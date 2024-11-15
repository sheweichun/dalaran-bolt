import { useCallback, useMemo, useRef, useState } from 'react';
import { StreamingMessageParser } from './messageParser';
import { IMessage, IMsgType, ISystemMessage, IUserMessage, SystemRole } from '../types';
import { Chat, getAppTemplate, ITemplateInfo } from '../../../../Chat/api';
import { IAttachment, useUploadHook } from '../../Attachment';
import WorkbenchStore from '../../stores/workbench';
import { getSystemPrompt } from '../../../../Chat/api/promts/system';
import { FileMap, FileMap2Record, transform2FileMap } from '../../../../Chat/models/file';
import { getAppPrompt } from '../../../../Chat/api/promts/app';
import WebContainerInstance from '../../stores/webcontainer';
// import { workbenchStore } from '~/lib/stores/workbench';
// import { createScopedLogger } from '~/utils/console';

// const console = createScopedLogger('useMessageParser');

const messageParser = new StreamingMessageParser({
  callbacks: {
    onArtifactOpen: (data) => {
      // console.log('onArtifactOpen',  JSON.stringify(data));
      WorkbenchStore.addArtifact(data)
    //   workbenchStore.showWorkbench.set(true);
    //   workbenchStore.addArtifact(data);
    },
    onArtifactClose: (data) => {
      // console.log('onArtifactClose', data.id, data);
      // console.log('onArtifactClose',  JSON.stringify(data));
      WorkbenchStore.updateArtifact(data, { closed: true });
    },
    onActionOpen: (data) => {
      // console.log('onActionOpen', data.action);

      // we only add shell actions when when the close tag got parsed because only then we have the content
      if (data.action.type !== 'shell') {
        WorkbenchStore.addAction(data);
      }
    },
    onActionClose: (data) => {
      // console.log('onActionClose', data.action);

      if (data.action.type === 'shell') {
        WorkbenchStore.addAction(data);
      }

      WorkbenchStore.runAction(data);
    },
  },
});

// function useMessageParser() {
//   const [parsedMessages, setParsedMessages] = useState<{ [key: number]: string }>({});

//   const parseMessages = useCallback((messages: IMessage[], isLoading: boolean) => {
//     let reset = false;

//     if (!isLoading) {
//       reset = true;
//       messageParser.reset();
//     }

//     for(let index = 0; index < messages.length; index++){
//       const message = messages[index];
//       if (message.role === 'assistant') {
//         const newParsedContent = messageParser.parse(message.id, message.content);
//         setParsedMessages((prevParsed) => ({
//           ...prevParsed,
//           [index]: !reset ? (prevParsed[index] || '') + newParsedContent : newParsedContent,
//         }));
//       }
//     }
//   }, []);

//   return { parsedMessages, parseMessages };
// }

let msgId = 1;

function createUserMessage(input: string, attachments: IAttachment[]): IUserMessage{
  return {
    type: IMsgType.User,
    id: `user-${msgId++}`,
    role: SystemRole.user,
    user:{
        logo: 'https://img.alicdn.com/imgextra/i1/O1CN0177eutL1OCRuIX0eab_!!6000000001669-2-tps-750-1000.png'
    },
    prompt: input,
    attachments
  }
}

function createSystemMessage(content: string, id: string): ISystemMessage{
  return {
    type: IMsgType.System,
    id,
    role: SystemRole.assistant,
    content: content
  }
}

const systemPrompt = {
  role: 'system',
  content: getSystemPrompt(),
}


function wrapLLMMessage(content: string, role = 'user'){
  return {
      role: role,
      content: content,
  }
}


export interface ChatParams{
  prompt: string
  attachments?:IAttachment[]
}

function transformParam2LLMMessage(params: ChatParams, prefixPrompt = `<running_commands>
</running_commands>`){
  const message: {role: string, content: string, experimental_attachments?: {
      name: string,
      contentType: string,
      url: string
  }[]} = {
      role: 'user',
      content: `${prefixPrompt}
${params.prompt}`,
  }
  if(params.attachments){
      message.experimental_attachments = params.attachments.map(item=>{
          return {
              name: item.name,
              contentType: item.mimeType,
              url: item.content,
          }
      })
  }
  return message
}

interface ILLMMessage{ role: string; content: string | Array<any> | undefined }

export interface ChatProp{
  fileMap: FileMap
}

export function useChat({ fileMap }: ChatProp){
  const {files, onAdd, onDelete, onClear} = useUploadHook()
  const [input, setInput] = useState('')
  const [ messages, setMessages] = useState<IMessage[]>([])
  // const parsedMessages = useRef<{ [key: number]: string }>({})
  const [chatStatus, setChatStatus] = useState({
		started: false,
		isStreaming: false
	})

  const fileRecords = useMemo(()=>{
    return FileMap2Record(fileMap)
  }, [fileMap])

  const appTemplateInfoRef = useRef<ITemplateInfo>()
  const appTemplatePromptRef = useRef<string>()
  // const msgIdRef = useRef(`system-${msgId++}`)
  const lastLLMQueryAndRespnseRef = useRef<{
    query:ChatParams,
    response: string
  } | undefined>()
  // const userLLMMessageListRef = useRef<Array<ILLMMessage>>([])


  const requestLLM = useCallback(async(llmMessages: ILLMMessage[], inMessages?: IMessage[])=>{
    const systemId = `system-${msgId++}`
    const prevMessage = inMessages || messages
    setChatStatus({
			started: true,
			isStreaming: true
		})
    let parsedContent = ''
    // const prevMessage = messages
		const msg = await Chat(llmMessages, {
			onMessage: function(msg){
        const newContent = messageParser.parse(systemId, msg);
        parsedContent += newContent
        setMessages([...prevMessage, createSystemMessage(parsedContent, systemId)])
        // console.log('parsedContent ;', parsedContent);
			}
		})
    setMessages([...prevMessage, createSystemMessage(parsedContent, systemId)])
		setChatStatus((prev)=>{
      return Object.assign(prev, {
        isStreaming: false
      })
    })
    return msg
  }, [input, messages])

  const sendMessage = useCallback(async()=>{
    const newUserMsg = createUserMessage(input, files)
    setInput('')
    onClear()
    const prevMessage = [...messages, newUserMsg]
    setMessages(prevMessage)
    const llmMessages: ILLMMessage[] = [systemPrompt]
    if(!appTemplateInfoRef.current){
      const appTemplate = await getAppTemplate(input)
      appTemplateInfoRef.current = appTemplate
      const templatePrompt = appTemplate.files['.dalaran/prompt']
      await WebContainerInstance.mount(transform2FileMap(appTemplate.files))
      if(templatePrompt){
        appTemplatePromptRef.current = templatePrompt
        llmMessages.push(wrapLLMMessage(templatePrompt))
      }
      llmMessages.push(getAppPrompt(appTemplate.files))
    }else{
      llmMessages.push(getAppPrompt(fileRecords))
      const lastLLMQueryAndRespnse = lastLLMQueryAndRespnseRef.current
      if(lastLLMQueryAndRespnse){
        llmMessages.push(wrapLLMMessage(lastLLMQueryAndRespnse.query.prompt))
        llmMessages.push(wrapLLMMessage(lastLLMQueryAndRespnse.response, 'assistant'))
      }
    }
    llmMessages.push(transformParam2LLMMessage({prompt: input, attachments: files}, WorkbenchStore.getCommandPrompt()))
		const assitant = await requestLLM(llmMessages, prevMessage)
    lastLLMQueryAndRespnseRef.current = {
      query: {
        prompt: input,
        attachments: files
      },
      response: assitant
    }
	}, [input, files, messages, requestLLM])
  return {
    started: chatStatus.started,
    isStreaming: chatStatus.isStreaming,
    inputOnChange: setInput,
    attachments:files, 
    onAttachmentAdd: onAdd, 
    onAttachmentDelete: onDelete,
    messages,
    input,
    sendMessage
  }
}