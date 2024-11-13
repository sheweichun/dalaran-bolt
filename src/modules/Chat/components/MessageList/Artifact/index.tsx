// import { useStore } from '@nanostores/react';
// import { computed } from 'nanostores';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from 'shiki';
import { ActionState, FailedActionState } from '../types/action';
import WorkbenchStore from '../../stores/workbench';
import s from './index.module.scss'
import { ArtifactState } from '../types';
// import type { ActionState } from '~/lib/runtime/action-runner';
// import { workbenchStore } from '~/lib/stores/workbench';
// import { classNames } from '~/utils/classNames';
// import { cubicEasingFn } from '~/utils/easings';

const highlighterOptions = {
  langs: ['shell'],
  themes: ['light-plus', 'dark-plus'],
};

let shellHighlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | undefined



interface ArtifactProps {
  // messageId: string;
  artifact: ArtifactState
  onBugFix?: (errorList: {cmd: string, error: string}[]) => void
}

export const Artifact = memo(({ artifact, onBugFix }: ArtifactProps) => {
  const userToggledActions = useRef(false);
  const [iterator, setIterator] = useState(0)
  const [showActions, setShowActions] = useState(false);

  const [ expanded, setExpanded ] = useState(true)

  // const artifacts = WorkbenchStore.artifacts;
  // const artifact = artifacts[messageId];

  const actions = Object.values(artifact.runner.actions)

  // const toggleActions = () => {
  //   userToggledActions.current = true;
  //   setShowActions(!showActions);
  // };
  const actionErrorList = useMemo(()=>{
    return actions.filter(action=>{
      return action.status === 'failed'
    }).map((item)=>{
      const { content, error } = item as FailedActionState
      return {
        cmd: content,
        error: error
      }
    })
  }, [actions])

  const onClickBugFix = useCallback(()=>{
    onBugFix && onBugFix(actionErrorList)
  }, [actionErrorList])

  useEffect(() => {
    if (actions.length && !showActions && !userToggledActions.current) {
      setShowActions(true);
    }
  }, [actions]);

  useEffect(()=>{
    artifact.setUpdateView(()=>{
      setIterator(iterator + 1)
    })
  }, [iterator, setIterator])

  return (
    <div className={s.con}>
      <div className={s.conHeader}>
        <div className={s.conHeaderTitle}>
          <span>{artifact?.title}</span>
          {actionErrorList.length > 0 ? <i onClick={onClickBugFix} className={`icon icon-bug ${s.bugFix}`}></i> : <></>}
        </div>
        <div className={s.conHeaderOpr} onClick={()=>{
          setExpanded(!expanded)
        }}>
          <i className={`icon icon-right ${expanded ? s.arrowDown : s.arrowUp}`}></i>
        </div>
      </div>
      {showActions && expanded && actions.length > 0 && (
            <div
            className={`${s.actions} actions`}
            > 
              <ActionList actions={actions}/>
            </div>
        )}
    </div>
  );
});

interface ShellCodeBlockProps {
  classsName?: string;
  code: string;
}

function ShellCodeBlock({ classsName, code }: ShellCodeBlockProps) {
  const [reRender, setRerender] = useState(false)
//   const codeRef = useRef('')
//   codeRef.current = code
  const init = useCallback(async()=>{
    if(!shellHighlighter) {
      shellHighlighter = await createHighlighter(highlighterOptions);
      setRerender(true)
    }
  }, [])

  const replaceCode = useMemo(()=>{
    return code.replace(/<\/?\w+>/g,'')
  }, [code])

  useEffect(()=>{
    init()
  }, [])
  return (
    <div
      className={classsName}
      dangerouslySetInnerHTML={{
        __html: shellHighlighter ? shellHighlighter.codeToHtml(replaceCode, {
          lang: 'shell',
          theme: 'dark-plus',
        }) : '',
      }}
    ></div>
  );
}

interface ActionListProps {
  actions: ActionState[];
}

// const actionVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

const ActionList = memo(({ actions }: ActionListProps) => {
  return (
    <ul className={s.actionList}>
        {actions.map((action, index) => {
          const { status, type, content } = action;
          // const isLast = index === actions.length - 1;
          const color = getIconColor(action.status)
          return (
            <li
              key={index}
            >
              <div className={s.actionRow}> 
                <div style={{color: color}}>
                  {status === 'running' ? (
                    <i className={`icon icon-running ${s.iAniSpin}`}></i>
                  ) : status === 'pending' ? (
                    <i className={`icon icon-pending ${s.fadeIn}`}></i>
                  ) : status === 'complete' ? (
                    <i className="icon icon-check"></i>
                  ) : status === 'failed' || status === 'aborted' ? (
                    <i className="icon icon-fail"></i>
                  ) : null}
                </div>
                {type === 'file' ? (
                  <div style={{marginLeft: '8px'}}>
                    <span style={{marginRight: '4px'}}>创建</span>
                    <code >
                      {action.filePath}
                    </code>
                  </div>
                ) : type === 'shell' ? (
                  <div style={{marginLeft: '8px', display: 'flex', alignItems: 'center'}}>
                    <span >运行shell命令</span>
                  </div>
                ) : null}
              </div>
              {type === 'shell' && (
                <ShellCodeBlock
                  classsName={s.shellBlk}
                  code={content}
                />
              )}
            </li>
          );
        })}
      </ul>
  );
});

function getIconColor(status: ActionState['status']) {
  switch (status) {
    case 'pending': {
      return '#E3E2E2';
    }
    case 'running': {
      return '#2BA6FF';
    }
    case 'complete': {
      return '#4ade80';
    }
    case 'aborted': {
      return '#A3A3A3';
    }
    case 'failed': {
      return '#F87171';
    }
    default: {
      return undefined;
    }
  }
}
