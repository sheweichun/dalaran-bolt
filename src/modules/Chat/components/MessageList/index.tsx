import React from 'react'
import { PhotoProvider } from 'react-photo-view';
import  { AttachmentFile, AttachmentType, AttachmentStatus, IAttachment } from '../Attachment/index'

import { Markdown } from './Markdown';
import { IMessage, IMsgType, IUserMessage, ISystemMessage, SystemRole } from './types'

import s from './index.module.scss'


function UserMessage({msg}: {msg: IUserMessage}){
    const attachments = msg.attachments || []
    return <div className={s.card}>
        <div className={s.user}>
            <div className={s.userLeft}>
                <img crossOrigin='anonymous' src={msg.user?.logo} />
            </div>
            <div className={s.userRight}>
                {attachments.length > 0 &&<div className={s.attachment}>
                    <PhotoProvider>
                        {
                            attachments.map((item, index)=>{
                                return <AttachmentFile item={item} key={index}/>
                            })
                        }
                    </PhotoProvider>
                </div>}
                <div className={s.prompt}>
                    <p>{msg.prompt}</p>
                </div>
            </div>
        </div>
    </div>
}

const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
const modificationsRegex = new RegExp(
`^<${MODIFICATIONS_TAG_NAME}>[\\s\\S]*?<\\/${MODIFICATIONS_TAG_NAME}>\\s+`,
'g',
);

function sanitizeUserMessage(content: string) {
    return content.replace(modificationsRegex, '').trim();
}

function SystemMessage({msg}: {msg: ISystemMessage}){
    return <div className={s.card}>
        <Markdown html>{sanitizeUserMessage(msg.content || '')}</Markdown>
        {/* {msg.content} */}
    </div>
}

export default function({data}: {data: IMessage[]}){

    // const data: IMessage[] = [
    //     {
    //         type: IMsgType.User,
    //         user:{
    //             logo: 'https://stackblitz.com/avatars/L/356.svg'
    //         },
    //         role: SystemRole.user,
    //         id: '1',
    //         attachments: [
    //             {
    //                 type: AttachmentType.Image,
    //                 content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
    //                 name: 'test.png',
    //                 status: AttachmentStatus.Uploaded
    //             },{
    //                 type: AttachmentType.File,
    //                 content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
    //                 name: 'AAOrisnakldjaOrisnakldjaOrisnakldja',
    //                 fileType: 'md',
    //                 status: AttachmentStatus.Uploaded
    //             }
    //         ],
    //         prompt: 'create a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello world'
    //     },{
    //         id: '2',
    //         type: IMsgType.System,
    //         role: SystemRole.assistant,
    //         content: 'create a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello world'
    //     }
    // ]

    return <div className={s.con}>
        <div className={s.wrap}>
            <div className={s.scroll}>
                {
                    (data || []).map((item, index)=>{
                        if(item.type == IMsgType.User){
                            return <UserMessage msg={item} key={index}></UserMessage>
                        }
                        return <SystemMessage msg={item} key={index}></SystemMessage>
                    })
                }
            </div>
        </div>
    </div>
}