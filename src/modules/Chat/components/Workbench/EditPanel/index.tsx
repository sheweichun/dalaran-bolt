import React, { useMemo } from 'react'
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';

import FileTree from '../FileTree'
import { FileMap, WORK_DIR } from '../../../models/file';
import CodeMirrorEditor, { EditorUpdate } from '../CodeMirrorEditor'


import { EditorDocument, EditorSettings, ITerminal } from '../types';

import s from './index.module.scss'
import { Terminal } from '../Terminal';





interface IEditPanelProp{
    isStreaming?: boolean,
    className?: string
    fileMap: FileMap,
    editorDocument: EditorDocument | undefined,
    selectedFile: string, 
    onSelectFile: (fullPath: string)=>void,
    terminalList: ITerminal[]
    onNewTerminal: ()=>void
    onRemoveTerminal: (index:number)=>void
    curTerminal:number
	onChangeCurTerminal:(index:number)=>void
    onChangeDocument: (update: EditorUpdate)=>void
    onSaveDocument: ()=>void
}
const editorSettings: EditorSettings = { tabSize: 2 };

export default function({
    isStreaming,
    fileMap,
    editorDocument,
    selectedFile, 
    onSelectFile,
    className,
    terminalList,
    onNewTerminal,
    onRemoveTerminal,
    curTerminal,
    onChangeDocument,
    onSaveDocument,
    onChangeCurTerminal,
}: IEditPanelProp){



    const showSelectedFile = useMemo(()=>{
        return selectedFile.replace(new RegExp(`${WORK_DIR}\/`, 'g'), '')
    }, [selectedFile])

    // const curTerminalInst = terminalList[curTerminal]

    return <PanelGroup direction='vertical' className={`${s.con} ${className || ''}`}>
        <Panel className={s.body} minSize={30}>
            <PanelGroup direction='horizontal'>
                <Panel className={s.bodyLeft} defaultSize={20} minSize={10}>
                    <div className={s.identity}>
                        <i className='icon icon-tree'></i>
                        <span style={{marginLeft: '4px'}}>Files</span>
                    </div>
                    <div className={s.treeCon}>
                        <FileTree 
                        selectedFile={selectedFile}
                        onFileSelect={onSelectFile}
                        files={fileMap} 
                        hideRoot 
                        rootFolder={WORK_DIR}></FileTree>
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel className={s.bodyRight}>
                    <div className={s.identityFile}>
                        {showSelectedFile ? <div className={s.identityFileLeft}>
                            <i className='icon icon-file'></i>
                            <span style={{marginLeft: '8px'}}>{showSelectedFile}</span>
                        </div> : <></>}
                    </div>
                    <div className={s.editorPanel}>
                        {
                            editorDocument ? <CodeMirrorEditor
                                theme={'dark'}
                                editable={!isStreaming && editorDocument !== undefined}
                                settings={editorSettings}
                                doc={editorDocument}
                                autoFocusOnDocumentChange
                                // onScroll={onEditorScroll}
                                onChange={onChangeDocument}
                                onSave={onSaveDocument}
                            ></CodeMirrorEditor> : <></>
                        }
                        
                    </div>
                </Panel>
            </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel className={s.bottom} defaultSize={30}>
            <div className={s.bottomOpr}>
                <div className={s.headTab}>
                    {
                        (terminalList || []).map((item, index)=>{
                            const isActive = index === curTerminal
                            return <div className={`${s.tabItem} ${isActive ? s.activeTabItem : ''}`} key={index} onClick={onChangeCurTerminal.bind(null, index)}>
                                <i className={`icon ${item.icon}`}></i>
                                <span style={item.style || {marginLeft: '8px'}}>{item.name}</span>
                            </div>
                        })
                    }
                </div>
                
                {/* <div className={s.addBtn} onClick={onNewTerminal}>
                    <i className='icon icon-plus'></i>
                </div> */}
            </div>
            <div className={s.body}>
                {
                    (terminalList || []).map((item, index)=>{
                        const isActive = index === curTerminal
                        return <Terminal key={index} className={`${s.terminal} ${!isActive ? s.hidden : ''}`} theme="dark" instance={item}></Terminal>
                    })
                }
                {/* <Terminal className={s.terminal} theme="dark" instance={curTerminalInst}></Terminal> */}
            </div>
        </Panel>
    </PanelGroup>
}