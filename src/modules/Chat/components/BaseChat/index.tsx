import React, { useState } from 'react';
import s from './index.module.scss';
import { PromptInput, PromptInputProps } from '../PromptInput';

export default function BaseChat(props: PromptInputProps) {
	return (
		<>
			<PromptInput {...props}></PromptInput>
		</>
	)
}
