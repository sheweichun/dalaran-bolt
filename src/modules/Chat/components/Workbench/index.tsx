import React, { useMemo } from 'react'

import { IMode } from './hooks/index'

import s from './index.module.scss'
import FileTree from './FileTree';
import { FileMap, WORK_DIR } from '../../models/file';
import CodeMirrorEditor, { EditorUpdate } from './CodeMirrorEditor';
import { EditorDocument, EditorSettings, ITerminal } from './types';
import EditPanel from './EditPanel';
import Preview from './Preview';



interface IWorkbenchProp{
    curMode: string;
    isStreaming?: boolean,
    modes: IMode[];
    previewUrl?: string,
    fileMap: FileMap,
    editorDocument: EditorDocument | undefined,
    selectedFile: string, 
    terminalList: ITerminal[]
    curTerminal:number
	onChangeCurTerminal:(index:number)=>void
    onNewTerminal: ()=>void
    onRemoveTerminal: (index:number)=>void
    onSelectFile: (fullPath: string)=>void,
    onChangeModel: (index:number)=>void;
    onChangeDocument: (update: EditorUpdate)=>void
    onSaveDocument: ()=>void
}



export default function({
    curMode, 
    modes, 
    isStreaming,
    onChangeModel, 
    terminalList,
    onNewTerminal,
    onRemoveTerminal,
    curTerminal,
    onChangeCurTerminal,
    onChangeDocument,
    onSaveDocument,
    fileMap,
    previewUrl,
    editorDocument,
    onSelectFile, 
    selectedFile,
}: IWorkbenchProp){

    // const showSelectedFile = useMemo(()=>{
    //     return selectedFile.replace(new RegExp(`${WORK_DIR}\/`, 'g'), '')
    // }, [selectedFile])

    return <div className={s.workbench}>
        
        <div className={s.headTab}>
            {
                (modes || []).map((item, index)=>{
                    return <div onClick={()=>{onChangeModel(index)}} key={item.value} className={`${s.tabItem} ${curMode === item.value ? s.activeTabItem : ''}`}>
                        {item.label}
                    </div>
                })
            }
        </div>
        <div className={s.body}>
            <EditPanel
                className={curMode === 'code'  ? '' : s.hidden}
                terminalList={terminalList}
                onNewTerminal={onNewTerminal}
                onRemoveTerminal={onRemoveTerminal}
                curTerminal={curTerminal}
                onChangeCurTerminal={onChangeCurTerminal}
                isStreaming={isStreaming}
                fileMap={fileMap}
                editorDocument={editorDocument}
                onChangeDocument={onChangeDocument}
                onSaveDocument={onSaveDocument}
                selectedFile={selectedFile} 
                onSelectFile={onSelectFile}
                ></EditPanel>  
            <Preview className={curMode !== 'code'  ? '' : s.hidden} url={previewUrl}></Preview>
        </div>
    </div>
}