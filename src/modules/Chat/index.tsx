import React, { useCallback, useState } from 'react';

import BaseChat from './components/BaseChat';
import { useUploadHook } from './components/Attachment';

import { Chat } from './api/index'
import 'react-photo-view/dist/react-photo-view.css';
import './index.css';

export default function Hello({}) {
	const {files, onAdd, onDelete} = useUploadHook();
	const [input, setInput] = useState('')
	const [chatStatus, setChatStatus] = useState({
		started: false,
		isStreaming: false
	})

	const sendMessage = useCallback(async()=>{
		setChatStatus({
			started: true,
			isStreaming: true
		})
		const msg = await Chat({
			prompt: input
		}, {
			onMessage: function(msg){
				// console.log('msg :', msg);
			}
		})
		console.log('over', msg)
		
	}, [])

	return (
		<>
			<BaseChat 
			chatStarted={chatStatus.started}
			isStreaming={chatStatus.isStreaming}
			files={files}
			onAddFiles={onAdd}
			onDeleteFile={onDelete}
			input={input} 
			sendMessage={sendMessage}
			handleInputChange={setInput}></BaseChat>
		</>
	)
}
