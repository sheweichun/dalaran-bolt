// import type { Message } from 'ai';
import React, { type RefCallback } from 'react';
import { Button, Icon} from '@alifd/next'
// import Attachment from '../Attachment'
import { Message } from '../../models/message';
import InputSvg from './inputSvg'
import { AttachmentUpload, AttachmentList, IAttachment } from '../Attachment'
// import { SendButton } from './SendButton.client';

import styles from './index.module.scss';
import MessageList from '../MessageList';

export interface PromptInputProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  files: IAttachment[];
  onAddFiles: (file: IAttachment[]) => void
  onDeleteFile?: (index: number) => void
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (val: string) => void;
  enhancePrompt?: () => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Build a simple blog using Astro' },
  { text: 'Create a cookie consent form using Material UI' },
  { text: 'Make a space invaders game' },
  { text: 'How do I center a div?' },
];

const TEXTAREA_MIN_HEIGHT = 76;

export const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      files,
      onAddFiles,
      onDeleteFile,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    // const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    return (
      <div
        ref={ref}
        className={styles.BaseChat}
        data-chat-visible={showChat}
      >
        <div ref={scrollRef} className={styles.BaseChatScroll}>
          <div className={styles.Chat}>
            {!chatStarted && (
              <div className={styles.intro}>
                <h1 className={styles.introText}>
                  Where ideas begin
                </h1>
                <p className={styles.introDesc}>
                  Bring ideas to life in seconds or get help on existing projects.
                </p>
              </div>
            )}
            <div
              className={`${styles.con} ${chatStarted ? styles.startedCon : ''}`}
            >
              {chatStarted ? <MessageList></MessageList> : <></>}
              <div
                style={{
                  position: 'relative',
                  padding: '0 24px',
                  width: '100%',
                  margin: '0 auto',
                  maxWidth: '552px'
                }}
              >
                <div
                  className={styles.inputWrap}
                >
                  {/* <Attachment /> */}
                  <InputSvg></InputSvg>

                  {!chatStarted && <AttachmentList files={files} onDelete={onDeleteFile}></AttachmentList>}
                  <div style={{position: 'relative', userSelect: 'none'}}>
                    <textarea
                      ref={textareaRef}
                      className={styles.inputEditor}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          if (event.shiftKey) {
                            return;
                          }

                          event.preventDefault();

                          sendMessage?.(event);
                        }
                      }}
                      value={input}
                      onChange={(event) => {
                        handleInputChange?.(event.target.value);
                      }}
                      // style={{
                      //   minHeight: TEXTAREA_MIN_HEIGHT,
                      //   maxHeight: TEXTAREA_MAX_HEIGHT,
                      // }}
                      placeholder="How can Bolt help you today?"
                      translate="no"
                    />
                    {(input.length > 0 || isStreaming ) && <button
                          className={styles.sendBtn}
                          // isStreaming={isStreaming}
                          onClick={(event) => {
                            if (isStreaming) {
                              handleStop?.();
                              return;
                            }

                            sendMessage?.(event);
                          }}
                      >
                        <i className="icon icon-right"></i>
                      </button>}
                  </div>
                  
                  <div className={styles.extra}>
                    <div className={styles.tools}>
                      <AttachmentUpload onAddFiles={onAddFiles}></AttachmentUpload>
                     
                      {/* <Button
                        title="Enhance prompt"
                        disabled={input.length === 0 || enhancingPrompt}
                        className={classNames({
                          'opacity-100!': enhancingPrompt,
                          'text-bolt-elements-item-contentAccent! pr-1.5 enabled:hover:bg-bolt-elements-item-backgroundAccent!':
                            promptEnhanced,
                        })}
                        onClick={() => enhancePrompt?.()}
                      >
                        {enhancingPrompt ? (
                          <>
                            <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl"></div>
                            <div className="ml-1.5">Enhancing prompt...</div>
                          </>
                        ) : (
                          <>
                            <div className="i-bolt:stars text-xl"></div>
                            {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
                          </>
                        )}
                      </Button> */}
                    </div>
                  
                    {input.length > 3 ? (
                      <div className={styles.tooltip}>
                        Use <kbd className={styles.kdb}>Shift</kbd> + <kbd className={styles.kdb}>Return</kbd> for a new line
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* <div className="bg-bolt-elements-background-depth-1 pb-6">Ghost Element</div> */}
              </div>
            </div>
            {!chatStarted && (
              <div id="examples" className={styles.examples}>
                <div className={styles.example}>
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                    return (
                      <a
                        key={index}
                        onClick={(event) => {
                          event.preventDefault()
                          sendMessage?.(event, examplePrompt.text);
                        }}
                        className={styles.exampleItem}
                      >
                        {examplePrompt.text}
                        <i className="icon icon-right" style={{marginLeft: '4px', fontSize: '12px'}}/>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* <ClientOnly>{() => <Workbench chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly> */}
        </div>
      </div>
    );
  },
);
