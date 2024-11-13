import React, { useCallback, useState } from 'react';

import BaseChat from './components/BaseChat';
import { useUploadHook } from './components/Attachment';

import { Chat } from './api/index'
import 'react-photo-view/dist/react-photo-view.css';

import { useChat } from './components/MessageList/hooks';

import s from './index.module.scss'
import './index.css';
import './bolt.css';
import Workbench from './components/Workbench';
import { useWorkbench } from './components/Workbench/hooks';
import { Markdown } from './components/MessageList/Markdown';

export default function Hello({}) {
	
	// const [input, setInput] = useState('')
	const { curMode, modes, previewUrl, onChangeModel,fileMap, selectedFile, onSelectFile, editorDocument, terminals, onNewTerminal, onRemoveTerminal, curTerminal,
        onChangeCurTerminal,
		onChangeDocument,
		onSaveDocument 
	} = useWorkbench()

	const { inputOnChange, input, started, messages, isStreaming, sendMessage, attachments, onAttachmentAdd, onAttachmentDelete } = useChat({
		fileMap
	})

// 	return <Workbench
// 	terminalList={terminals}
// 	onNewTerminal={onNewTerminal}
// 	onRemoveTerminal={onRemoveTerminal}
// 	curTerminal={curTerminal}
// 	onChangeCurTerminal={onChangeCurTerminal}
// 	selectedFile={selectedFile}
// 	onSelectFile={onSelectFile}
// 	modes={modes}
// 	previewUrl={previewUrl}
// 	isStreaming={isStreaming}
// 	curMode={curMode}
// 	editorDocument={editorDocument}
// 	onChangeModel={onChangeModel}
// 	fileMap = {fileMap}
// ></Workbench>
	return (
		<div className={s.con}>
			{/* <Markdown html>{`sasasa\`npm run dev\``}</Markdown> */}
			<BaseChat 
			className={started ? '': s.fullW}
			chatStarted={started}
			isStreaming={isStreaming}
			files={attachments}
			onAddFiles={onAttachmentAdd}
			onDeleteFile={onAttachmentDelete}
			messages={messages}
			input={input} 
			sendMessage={sendMessage}
			handleInputChange={inputOnChange}></BaseChat>
			{started ?<div className={s.right}>
			<Workbench
				terminalList={terminals}
				onNewTerminal={onNewTerminal}
				onRemoveTerminal={onRemoveTerminal}
				curTerminal={curTerminal}
				onChangeCurTerminal={onChangeCurTerminal}
				selectedFile={selectedFile}
				onSelectFile={onSelectFile}
				modes={modes}
				previewUrl={previewUrl}
				isStreaming={isStreaming}
				curMode={curMode}
				editorDocument={editorDocument}
				onChangeModel={onChangeModel}
				fileMap = {fileMap}
				onChangeDocument={onChangeDocument}
				onSaveDocument={onSaveDocument}
			></Workbench>
			</div> : <></>}
		</div>
	)
}
{/* <Workbench
fileMap = {fileMap}
selectedFile={selectedFile}
onSelectFile={onSelectFile}
modes={modes}
curMode={curMode}
onChangeModel={onChangeModel}
></Workbench> */}