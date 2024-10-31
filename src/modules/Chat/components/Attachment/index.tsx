import React, { useMemo, useState } from 'react'

import s from './index.module.scss'
import { Icon, Loading } from '@alifd/next'
import { PhotoProvider, PhotoView } from 'react-photo-view';
// import { Preview } from './preview'

export enum AttachmentType {    
    Image = 'image',
    File = 'file'
}

export enum AttachmentStatus{
    Uploading = 'uploading',
    Uploaded = 'uploaded',
    Failed = 'failed'
}

export interface IAttachment{
    type: AttachmentType,
    status: AttachmentStatus,
    name: string,
    content: string,
    file?: File
    fileType?: string

}

export interface IAttachmentListProps{
    files?: IAttachment[]
    onDelete?: (index: number) => void
    onPreview?: (index: number) => void
}

function convertToBase64(file): Promise<string>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();

        reader.onloadend = () => {
            return resolve(reader.result as string)
        };

        reader.readAsDataURL(file); // 读取文件为Base64字符串
    })
  };


export function AttachmentFile({item, onClick}: {item: IAttachment, onClick?: ()=>void}){
    // console.log('item :', item, item.status);
    if(item.status === AttachmentStatus.Uploading){
        return  <div className={s.attachmentCon}>
            <Loading style={{display: 'inline-block'}}/>
        </div> 
    }
    if(item.type === AttachmentType.Image){
        return <div className={s.attachmentCon} onClick={onClick}>
            <PhotoView src={item.content} key={item.name}>
                <img className={s.img} src={item.content} alt={item.name}  />
            </PhotoView>
            
        </div>
    }else if(item.type === AttachmentType.File){
        return <div className={s.attachmentCon}>
            <div className={s.fileType}>
                {item.fileType}
            </div>
            <div className={s.fileName}>
                {item.name}
            </div>
        </div>
    }
    return <></>
}

export function useUploadHook(){
    const [ files, setFiles ] = useState<IAttachment[]>([
        {
            type: AttachmentType.Image,
            content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
            name: 'test.png',
            status: AttachmentStatus.Uploaded
        },
        {
            type: AttachmentType.File,
            content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
            name: 'AAOrisnakldjaOrisnakldjaOrisnakldja',
            fileType: 'md',
            status: AttachmentStatus.Uploaded
        }
        // ,{
        //     type: AttachmentType.File,
        //     content:'https://img.alicdn.com/imgextra/i4/O1CN019imKkM1Qid4YlogUL_!!6000000002010-2-tps-1928-748.png',
        //     name: 'aaaaa',
        //     fileType: 'md',
        //     status: AttachmentStatus.Uploading
        // }
    ] as IAttachment[])

    const fileNameMap = useMemo(()=>{
        return files.reduce((result, file) => {
            result[file.name] = file;
            return result;
        }, {});
    }, [files])

    return {
        files,
        onAdd: (newFiles: IAttachment[]) => {
            const needAddFiles: IAttachment[] = []
            newFiles.forEach(file => {
                if (!fileNameMap[file.name]) {
                    needAddFiles.push(file);
                } else{
                    fileNameMap[file.name] = file
                }
            });
            setFiles([...files, ...needAddFiles])
        },
        onDelete: (index: number) => {
            setFiles(files.filter((_, i) => i !== index))
        }
    }
}


export function AttachmentList({
    files,
    onDelete,
}: IAttachmentListProps){

    // const previewImgs = useMemo(()=>{
    //     return (files || []).filter(file => file.type === AttachmentType.Image).map(file => {
    //         return {
    //             name: file.name,
    //             value: file.content
    //         }
    //     })
    // }, [files])

    if(!files || files.length === 0) return <></>
    return <div className={s.listCon}>
        <PhotoProvider>
            <div className={s.list}>
                {
                    files.map((file, index)=>{
                        return  <div style={{position: 'relative'}} key={index}>
                            <AttachmentFile item={file} ></AttachmentFile>
                            <button className={s.iconBtn} onClick={onDelete?.bind(null, index)}>
                                <Icon type="close" size="xs" />
                            </button>
                        </div>
                    })
                }
            </div>
        </PhotoProvider>
    </div>
} 


export function AttachmentUpload({onAddFiles}:{onAddFiles: (files: IAttachment[])=>void}){


    const handleImageChange = async (event) => {
        const files: File[] = event.target.files;
        const attachmentFiles: IAttachment[] = []
        for(let i = 0; i < files.length; i++){
            const curFile = files[i]
            if(curFile.type.startsWith('image/')){
                // const base64 = await convertToBase64(curFile)
                attachmentFiles.push({
                    type: AttachmentType.Image,
                    content: '',
                    name: curFile.name,
                    file: curFile,
                    status: AttachmentStatus.Uploading
                })
            }else{
                const typeArr = curFile.type.split('/')
                const fileType = typeArr[1]
                attachmentFiles.push({
                    type: AttachmentType.File,
                    fileType: fileType,
                    content: '',
                    file: curFile,
                    status: AttachmentStatus.Uploaded,
                    name: curFile.name,
                })
            }
        }
        onAddFiles && onAddFiles(attachmentFiles)
        for(let i = 0; i < attachmentFiles.length; i++){
            const curAttachmentFile = attachmentFiles[i];
            if(curAttachmentFile.type === AttachmentType.Image){
                const base64 = await convertToBase64(curAttachmentFile.file)
                curAttachmentFile.content = base64
                curAttachmentFile.status = AttachmentStatus.Uploaded
            }
        }
        onAddFiles && onAddFiles(attachmentFiles)
      };

    return <label htmlFor="file">
    <input type="file" id="file"
        accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx,.js,.mjs,.cjs,.jsx,.html,.css,.scss,.sass,.ts,.tsx,.csv,.log,.json,.md" 
        multiple={true}
        style={{display: 'none'}} onChange={handleImageChange}></input> 
    <div className={s.btn}>
      <i className='icon icon-attachment'></i>
    </div>
  </label>
}

