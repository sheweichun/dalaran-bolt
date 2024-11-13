import { fetchEventSource } from '@microsoft/fetch-event-source';
import { EventType, parseStreamResponse } from './parseStreamResponse';
import axios from 'axios';
import { baseUrl } from './api';
import { throttle } from 'lodash';
import { Message } from '@alifd/next';

export interface IChatParams {
  model: string;
  messages: Array<{ role: string; content: string | Array<any> | undefined }>;
  temperature?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface IChatResult {
  content: string;
  segmentContent: string;
  originalResponse: any;
}

interface StreamChatParams {
  chatParams: IChatParams;
  onMessage: (msg: IChatResult) => any;
  /**
   * 大模型的流式返回每次是一个"单词", 会导致返回碎片化，所以提供一个缓存1秒钟内的输出的函数，便于结合打字机效果进行优化
   * @param msg
   */
  onIntervalMessage?: (msg: Omit<IChatResult, 'originalResponse'>) => any;
  onComplete: (msg: IChatResult) => void;
  onError?: (msg: string) => void;
  onErrorMessage?: (reason: string) => void;
}

let abortController = new AbortController();

/**
 * 终止流式对话
 */
export const stopResponseSSE = function () {
  abortController.abort();
  abortController = new AbortController();
};

/**
 * 实时流式对话
 * @param options
 */
export const streamChat = function (options: StreamChatParams) {
  const { chatParams, onMessage, onError, onComplete, onIntervalMessage, onErrorMessage } = options;
  let content = '';
  let cachedContent = '';

  const handleIntervalMessage = function () {
    if (onIntervalMessage && cachedContent) {
      onIntervalMessage({
        content: cachedContent,
        segmentContent: cachedContent,
      });
      cachedContent = ''; // 重置缓存
    }
  };
  // 使用debounce来缓存1秒内的返回
  const throttleOnMessage = throttle(handleIntervalMessage, 1000);
  fetchEventSource(`${baseUrl}/v1/model/ai-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      max_tokens: 4096,
      ...chatParams,
      stream: true,
    }),
    openWhenHidden: true,
    onmessage(msg) {
      const parseResult = parseStreamResponse(msg);
      if (parseResult.eventType === EventType.Message) {
        content += parseResult.content;
        cachedContent += parseResult.content;
        throttleOnMessage();
        onMessage({
          content,
          segmentContent: parseResult.content,
          originalResponse: msg,
        });
      } else if (parseResult.eventType === EventType.Complete) {
        handleIntervalMessage();
        onComplete({
          content,
          segmentContent: parseResult.content,
          originalResponse: msg,
        });
      } else if (parseResult.eventType === EventType.MessageError) {
        onErrorMessage && onErrorMessage(parseResult.content);
      }
    },
    onclose() {
      console.log('onclose');
    },
    onerror(err) {
      console.log('onerror', err);
      onError && onError(err.message);
    },
    signal: abortController.signal,
  });
};

/**
 * 流式对话, async generator
 * @param options
 */
export const streamChatAsyncGenerator = async function* (options: { chatParams: IChatParams }): AsyncGenerator<string> {
  const { chatParams } = options;
  let responseBufferList: string[] = [];
  let isComplete = false;

  const streamPromise = new Promise<void>((resolve, reject) => {
    streamChat({
      chatParams: chatParams,
      onMessage: () => {},
      onIntervalMessage: msg => {
        const { segmentContent } = msg;
        responseBufferList.push(segmentContent);
      },
      onComplete: msg => {
        isComplete = true;
        resolve();
      },
      onError: error => {
        reject(error);
      },
      onErrorMessage: reason => {
        const map = {
          max_tokens: '当前设计稿无法完整转化为代码。请降低设计稿复杂度后重试！',
        };

        Message.error(map[reason] || '大模型返回错误：' + reason);
      },
    });
  });

  while (!isComplete || responseBufferList.length > 0) {
    if (responseBufferList.length > 0) {
      yield responseBufferList.shift()!;
    } else {
      await new Promise(resolve => setTimeout(resolve, 250)); // 小暂停，避免过度占用 CPU
    }
  }

  await streamPromise; // 确保 streamChat 完全结束
};

/**
 * 单轮非流式对话
 * @param options
 */
export const chat = async function (options: IChatParams): Promise<IChatResult> {
  const resp = await axios.post(
    '/v1/model/ai-chat',
    {
      max_tokens: 4096,
      ...options,
      stream: false,
    },
    {
      timeout: 600 * 1000,
    },
  );
  const data = resp.data;
  if (Array.isArray(data.choices) && data.choices.length > 0) {
    return {
      content: data.choices[0]?.message?.content,
      originalResponse: data,
      segmentContent: data.choices[0]?.message?.content,
    };
  }
  return {
    content: '',
    originalResponse: data,
    segmentContent: '',
  };
};



// streamChat({
//   chatParams: inputParams,
//   onMessage: msg => {
//     console.log('onMessage', msg);
//     setOriginResult(msg.content);
//   },
//   onComplete: msg => {
//     console.log('onComplete', msg);
//     setStreamComplete(true);
//     setLoading(false);
//     Message.success('大模型输出完毕');
//     setOutputTabIndex('preview');
//   },
//   onError: msg => {
//     setLoading(false);
//   },
// });