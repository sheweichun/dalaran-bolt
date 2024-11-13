import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal as XTerm } from '@xterm/xterm';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import type { ITerminal, Theme } from '../types/index';
import { getTerminalTheme } from './theme';

import '@xterm/xterm/css/xterm.css';


export interface TerminalRef {
  reloadStyles: () => void;
}

export interface TerminalProps {
  className?: string;
  theme: Theme;
  readonly?: boolean;
  instance: ITerminal
  // onTerminalReady?: (terminal: XTerm) => void;
  // onTerminalResize?: (cols: number, rows: number) => void;
}

export const Terminal = memo(
  forwardRef<TerminalRef, TerminalProps>(
    ({ className, theme, readonly, instance }, ref) => {
    const terminalElementRef = useRef<HTMLDivElement>(null);
    // const terminalRef = useRef<XTerm>();

    useEffect(() => {
      const element = terminalElementRef.current!;

      instance.onTerminalDOMReady(element);

      return () => {
        instance.dispose()
      };
    }, []);

    // useEffect(() => {
    //   const terminal = terminalRef.current!;

    //   // we render a transparent cursor in case the terminal is readonly
    //   terminal.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});

    //   terminal.options.disableStdin = readonly;
    // }, [theme, readonly]);

    useImperativeHandle(ref, () => {
      return {
        reloadStyles: () => {
          // const terminal = terminalRef.current!;
          // terminal.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});
        },
      };
    }, []);

    return <div className={className} ref={terminalElementRef} />;
  }),
);
