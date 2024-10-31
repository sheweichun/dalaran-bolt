import React from 'react'
import { PhotoProvider } from 'react-photo-view';
import  { AttachmentFile, AttachmentType, AttachmentStatus, IAttachment } from '../Attachment/index'
import s from './index.module.scss'
import { Markdown } from './Markdown';


export enum IMsgType{
    User,
    System
}

interface IMessage{
    type: IMsgType
    user?:{
        logo: string
    },
    attachments?: IAttachment[]
    prompt?: string
    content?: string
}


function UserMessage({msg}: {msg: IMessage}){
    const attachments = msg.attachments || []
    return <div className={s.card}>
        <div className={s.user}>
            <div className={s.userLeft}>
                <img src={msg.user?.logo} />
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
                    <p>create a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello world</p>
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

function SystemMessage({msg}: {msg: IMessage}){
    return <div className={s.card}>
        <Markdown limitedMarkdown>{sanitizeUserMessage(msg.content || '')}</Markdown>
        {msg.content}
    </div>
}

export default function(){

    const data: IMessage[] = [
        {
            type: IMsgType.User,
            user:{
                logo: 'https://stackblitz.com/avatars/L/356.svg'
            },
            attachments: [
                {
                    type: AttachmentType.Image,
                    content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
                    name: 'test.png',
                    status: AttachmentStatus.Uploaded
                },{
                    type: AttachmentType.File,
                    content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
                    name: 'AAOrisnakldjaOrisnakldjaOrisnakldja',
                    fileType: 'md',
                    status: AttachmentStatus.Uploaded
                }
            ],
            prompt: 'create a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello world'
        },{
            type: IMsgType.System,
            content: 'create a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello worldcreate a page, content is hello world'
        }
    ]

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