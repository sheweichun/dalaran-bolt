import { IAttachment } from '../components/Attachment'
import WebContainerInstance from '../components/stores/webcontainer'
import WorkbenchStore from '../components/stores/workbench'
import { MOCK_FILES } from '../mock/file'
import { TEMPLATE_FILES } from '../mock/page'
import MockResult from '../mock/pageRes'
import { File, FileMap, transform2FileMap } from '../models/file'
import { IChatResult, streamChat } from './llm'
import { getAppPrompt } from './promts/app'
import { getSystemPrompt } from './promts/system'

export interface ITemplateInfo{
    id: string,
    files: Record<string, string>
}

export interface ChatParams{
    prompt: string
    attachments?:IAttachment[]
}

export interface ChatOption{
    onMessage?: (msg: string) => void
}


function sleep(number: number){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(null)
        }, number)
    })
}


export function getAppTemplate(prompt: string): Promise<ITemplateInfo>{
    return new Promise((resolve, reject)=>{
        return resolve(TEMPLATE_FILES)
    })
}

export async function Chat(llmMessages: Array<{ role: string; content: string | Array<any> | undefined }>, opt: ChatOption): Promise<string>{ 
    // console.log('messages :', llmMessages);
    return new Promise((resolve, reject)=>{
        streamChat({
            chatParams: {
                model: 'claude35_sonnet',
                max_tokens: 8000,
                messages: llmMessages,
                temperature: 0.2
            },
            onMessage(msg: IChatResult){
                // console.log('in onMessage :', msg);
                opt.onMessage && opt.onMessage(msg.content)
            },
            /**
             * 大模型的流式返回每次是一个"单词", 会导致返回碎片化，所以提供一个缓存1秒钟内的输出的函数，便于结合打字机效果进行优化
             * @param msg
             */
            // onIntervalMessage(msg: Omit<IChatResult, 'originalResponse'>){
    
            // },
            onComplete(msg: IChatResult){
                console.log('in onComplete :', msg);
                // WorkbenchStore.getCurArtifact().runner.
                resolve(msg.content)
            },
            onError(msg: string){
                reject(new Error(msg))
            },
            // onErrorMessage(reason: string){
    
            // }
        })
    })
    
    // const charList = MockResult.split('');
    // // await sleep(0);
    // for(let i = 0; i < charList.length; i++){
    //     // await sleep(5);
    //     opt.onMessage && opt.onMessage(MockResult.slice(0, i + 1))
    // }
    // return MockResult
}


// streamChat({
//     chatParams: inputParams,
//     onMessage: msg => {
//       console.log('onMessage', msg);
//       setOriginResult(msg.content);
//     },
//     onComplete: msg => {
//       console.log('onComplete', msg);
//       setStreamComplete(true);
//       setLoading(false);
//       Message.success('大模型输出完毕');
//       setOutputTabIndex('preview');
//     },
//     onError: msg => {
//       setLoading(false);
//     },
//   });