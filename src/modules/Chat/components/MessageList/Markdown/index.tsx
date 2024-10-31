import React, { memo, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import type { BundledLanguage } from 'shiki';
// import { createScopedLogger } from '~/utils/console';
import { rehypePlugins, remarkPlugins, allowedHTMLElements } from './util';
// import { Artifact } from './Artifact';
import { CodeBlock } from '../CodeBlock';

import styles from './index.module.scss';

// const console = createScopedLogger('MarkdownComponent');

interface MarkdownProps {
  children: string;
  html?: boolean;
  limitedMarkdown?: boolean;
}

export const Markdown = memo(({ children, html = false, limitedMarkdown = false }: MarkdownProps) => {

  const components = useMemo(() => {
    return {
    //   div: ({ className, children, node, ...props }) => {
    //     if (className?.includes('__boltArtifact__')) {
    //       const messageId = node?.properties.dataMessageId as string;

    //       if (!messageId) {
    //         console.error(`Invalid message id ${messageId}`);
    //       }

    //       return <Artifact messageId={messageId} />;
    //     }

    //     return (
    //       <div className={className} {...props}>
    //         {children}
    //       </div>
    //     );
    //   },
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

  return (
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
  );
});
