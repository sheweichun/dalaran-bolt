import React, { memo, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import type { BundledLanguage } from 'shiki';
// import { createScopedLogger } from '~/utils/console';
import { rehypePlugins, remarkPlugins, allowedHTMLElements } from './util';
import { Artifact } from '../Artifact';
import { CodeBlock } from '../CodeBlock';

import styles from './index.module.scss';
import WorkbenchStore from '../../stores/workbench';

// const console = createScopedLogger('MarkdownComponent');

interface MarkdownProps {
  children: string;
  html?: boolean;
  limitedMarkdown?: boolean;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {
  hasError: boolean
}> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 可以将错误日志上报给服务器
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      // 可以渲染任何自定义的降级 UI
      return <h1>出错了！</h1>;
    }

    return this.props.children; 
  }
}


export const Markdown = memo(({ children, html = false, limitedMarkdown = false }: MarkdownProps) => {
  // console.log('content :', children);
  const components = useMemo(() => {
    return {
      div: ({ className, children, node, ...props }) => {
        if (className?.includes('__dalaranPage__')) {
          const messageId = node?.properties?.dataMessageId as string;
          // const messageId = node?.properties?.dataId as string;

          if (!messageId) {
            console.error(`Invalid message id ${messageId}`);
          }
          const curArtifact = WorkbenchStore.artifacts[messageId];
          if(!curArtifact) return <></>
          return <Artifact artifact={curArtifact} onBugFix={WorkbenchStore.onBugFix}/>;
        }

        return (
          <div className={className} {...props}>
            {children}
          </div>
        );
      },
      pre: (props) => {
        const { children, node, ...rest } = props;

        const [firstChild] = node?.children ?? [];

        if (
          firstChild &&
          firstChild.type === 'element' &&
          firstChild.tagName === 'code' &&
          firstChild.children[0].type === 'text'
        ) {
          //@ts-ignore
          const { className, ...rest } = firstChild.properties;
          const [, language = 'plaintext'] = /language-(\w+)/.exec(String(className) || '') ?? [];

          return <CodeBlock code={firstChild.children[0].value} language={language as BundledLanguage} {...rest} />;
        }

        return <pre {...rest}>{children}</pre>;
      },
    } satisfies Components;
  }, []);
  // console.log('children :', children);
  return (<ErrorBoundary>
    <ReactMarkdown
      allowedElements={allowedHTMLElements}
      className={styles.MarkdownContent}
      components={components}
      //@ts-ignore
      remarkPlugins={remarkPlugins(limitedMarkdown)}
      // @ts-ignore
      rehypePlugins={rehypePlugins(html)}
    >
      {children}
    </ReactMarkdown>
    </ErrorBoundary>);
});
