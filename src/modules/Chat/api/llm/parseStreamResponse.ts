import { EventSourceMessage } from '@microsoft/fetch-event-source/lib/cjs/parse';


export const safetyParse = function (content: string | Record<any, any>): Record<string, any> {
    if (!content) return {};
    let result = {};
    if (typeof content === 'string') {
      try {
        result = JSON.parse(content);
      } catch (e) {
        console.warn('JSON parse error:', e, 'content is:', content);
        // @ts-ignore
        result = content;
      }
    } else {
      result = content;
    }
    return result;
  };
  

const COMPLETE_FLAG = '[DONE]';

export enum EventType {
  Message = 'message',
  Complete = 'complete',
  MessageError = 'messageError',
  Null = 'null',
}

interface ParseResult {
  eventType: EventType;
  content: string;
}

const errorFinishReasons = ['max_tokens'];

export const parseStreamResponse = function (response: EventSourceMessage): ParseResult {
  const { data } = response;

  if (data === COMPLETE_FLAG) {
    return {
      eventType: EventType.Complete,
      content: data,
    };
  }

  const dataObj = safetyParse(data);
  const choices = dataObj.choices ?? [];

  if (!Array.isArray(choices) || choices.length < 1) {
    return {
      eventType: EventType.Null,
      content: data,
    };
  }

  const choice = choices[0];
  const content = choice?.delta?.content;
  const finishReason = choice.finish_reason;


  if (errorFinishReasons.includes(finishReason)) {
    return {
      eventType: EventType.MessageError,
      content: finishReason,
    };
  }

  if (content) {
    return {
      eventType: EventType.Message,
      content,
    };
  }

  return {
    eventType: EventType.Null,
    content: data,
  };
};
