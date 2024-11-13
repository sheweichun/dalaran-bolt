import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { File, FileMap, userPath2SystemPath, WORK_DIR } from "../../../models/file"
// import { MockFileMap } from "../../../mock/file"
import { EditorDocument, ITerminal } from "../types"
import AIWebContainer, { FILE_OPR_TYPE, FileOpr } from "../../stores/webcontainer"
import { TerminalInst } from "../../stores/terminal"
import WebContainerInstance from "../../stores/webcontainer"
import { EditorUpdate } from "../CodeMirrorEditor"


export interface IMode{
    label: string
    value: string
}

const MODES: IMode[] = [
    {
        label: '代码',
        value: 'code'
    },
    {
        label: '预览',
        value: 'preview'
    }
]

// function getDirectory(nameList: string[], treeItem: Record<string, any> = {}){
//     if(nameList.length < 1) return treeItem
//     let target = treeItem;
//     for(let i = 0; i < nameList.length; i++){
//         const curVal = nameList[i]
//         if(!target[curVal]){
//             target[curVal] = {
//                 directory : {}
//             }
//         }
//         target = target[curVal].directory
//     }
//     return target
// }



const aiWebContainer = AIWebContainer

export function useWorkbench(){

    const [modeIndex, setModeIndex] = useState(0)
    const [fileMap, setFileMap] = useState<FileMap>({})
    
    const [selectedFile, onSelectFile] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')

    const changedFileMap = useRef<Record<string, string>>({})

    // const [ changedFileMap, setChangedFileMap] = useState<Record<string, string>>({})

    const [ terminals, setTerminals] = useState<ITerminal[]>(()=>{
        return TerminalInst.create([
            {
                name: 'Dalaran',
                icon: 'icon-light',
                style: {marginLeft: '4px'},
                readonly: true,
                webcontainer: aiWebContainer
            },{
                name: 'Terminal',
                icon: 'icon-terminal',
                webcontainer: aiWebContainer
            }
        ])
    })

    const [curTerminal, setCurTerminal] = useState(0)

    const editorDocument: EditorDocument | undefined = useMemo(()=>{
        const item = fileMap[selectedFile]
        if(!item || item.type === 'folder') return undefined
        const changedFileMapVal = changedFileMap.current
        return {
            value: item.modified ? changedFileMapVal[selectedFile] || item.content : item.content,
            isBinary: item.isBinary,
            filePath: selectedFile
        }
    }, [fileMap, selectedFile])

    const curSelectFile = useMemo(()=>{
        const item = fileMap[selectedFile]
        if(!item || item.type === 'folder') return undefined
        return item
    }, [fileMap, selectedFile])

    const curMode = MODES[modeIndex].value    

    const onNewTerminal = useCallback(()=>{
        setTerminals([...terminals, ...(TerminalInst.create([{
            name: 'Terminal',
            icon: 'icon-terminal',
            canDelete: true,
            webcontainer: aiWebContainer
        }]))])
    }, [terminals])


    const onRemoveTerminal = useCallback((index)=>{
        terminals.splice(index, 1)
        setTerminals([...terminals])
    }, [terminals])
    useEffect(()=>{
        WebContainerInstance.setUpdatePreviewUrl((url: string)=>{
            setModeIndex(1)
            setPreviewUrl(url)
        })
    }, [])
    useEffect(()=>{
        WebContainerInstance.setUpdateFileMapHandler((oprs: (FileOpr | undefined)[])=>{
            let prevSelectFile = selectedFile
            let curTmpSelectFile = selectedFile
            setFileMap((oldFileMap)=>{
                // console.log('oldFileMap :', oldFileMap, oprs);
           
                oprs.forEach((opr, index)=>{
                    if(!opr) return
                    const { type, fileName, content} = opr
                    if(type === FILE_OPR_TYPE.ADD || type === FILE_OPR_TYPE.UPDATE){
                        oldFileMap[fileName] = Object.assign(oldFileMap[fileName] || {} , content)
                        if(index === oprs.length - 1 && content?.type === 'file'){
                            curTmpSelectFile = fileName
                        }
                    }else if(type === FILE_OPR_TYPE.DELETE){
                        delete oldFileMap[fileName]
                        if(fileName === curTmpSelectFile){
                            curTmpSelectFile = ''
                        }
                    }
                })
                
                return {
                    ...oldFileMap
                }
            })
            if(curTmpSelectFile !== prevSelectFile){
                onSelectFile(curTmpSelectFile)
            }
            // console.log('onUpdateFileMapHandler :', oprs
            // if(oprs.length === 1){
            //     const item = oprs[0]
            //     item && (onSelectFile(item.fileName))
            // }
        })
    }, [fileMap, setFileMap, onSelectFile])

    const onChangeDocument = useCallback((update: EditorUpdate)=>{
       
        if(!curSelectFile) return
        const targetFilePath = selectedFile
        //  console.log('onChangeDocument :', update.content === editorDocument.value,update.content, editorDocument.value);
        if(update.content === curSelectFile.content){
            delete changedFileMap.current[targetFilePath]
            if(curSelectFile.modified){
                curSelectFile.modified = false
                setFileMap({
                    ...fileMap
                })
            }
            return
        }
        changedFileMap.current[targetFilePath] = update.content
        
        if(!curSelectFile.modified){
            curSelectFile.modified = true
            setFileMap({
                ...fileMap
            })
        }
    }, [fileMap, curSelectFile, selectedFile])

    const onSaveDocument = useCallback(async()=>{
        if(!curSelectFile) return

        if(curSelectFile.modified){
            const modifiedContent = changedFileMap.current[selectedFile]
            curSelectFile.modified = false
            curSelectFile.content = modifiedContent
            delete changedFileMap.current[selectedFile]
            const fs = await WebContainerInstance.getFileSystem()
            setFileMap({
                ...fileMap
            })
            await WebContainerInstance.systemWriteFile(selectedFile, modifiedContent)
        }
    }, [curSelectFile, selectedFile])

    return {
        modeIndex,
        curMode,
        modes: MODES,
        previewUrl,
        fileMap,
        selectedFile,
        onSelectFile,
        editorDocument,
        onChangeDocument,
        onSaveDocument,
        onChangeModel: setModeIndex,
        terminals,
        onNewTerminal,
        onRemoveTerminal,
        curTerminal,
        onChangeCurTerminal:setCurTerminal
    }
}