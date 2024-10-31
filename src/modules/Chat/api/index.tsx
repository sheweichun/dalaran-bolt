import MockResult from '../mock/index'

export interface ChatParams{
    prompt: string
    attachments?:{
        name: string,
        value: any,
        type: string,
        fileType: string
    }[]
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

export function Chat(params: ChatParams, opt: ChatOption){
    return new Promise(async (resolve, reject)=>{
        const charList = MockResult.split('');
        await sleep(300);
        for(let i = 0; i < charList.length; i++){
            // await sleep(0);
            opt.onMessage && opt.onMessage(MockResult.slice(0, i + 1))
        }
        resolve(MockResult)
    })
}