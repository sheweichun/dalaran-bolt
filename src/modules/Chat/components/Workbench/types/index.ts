export type Theme = 'dark' | 'light';
export interface EditorSettings {
    fontSize?: string;
    gutterFontSize?: string;
    tabSize?: number;
  }
  
  export interface ScrollPosition {
    top: number;
    left: number;
  }
  export interface EditorDocument {
    value: string;
    isBinary: boolean;
    filePath: string;
    scroll?: ScrollPosition;
  }
  
  
  export type TextEditorDocument = EditorDocument & {
    value: string;
  };


  export interface ITerminal{
    readonly cols?: number;
    readonly rows?: number;
    name: string,
    icon: string,
    canDelete?: boolean
    style?: any
    onTerminalDOMReady: (el: HTMLElement) => void
    reset: () => void;
    write: (data: string) => void;
    onData: (cb: (data: string) => void) => void;
    dispose:  ()=>void
  }


  // export interface ITerminalOption{
  //   readonly?: boolean, 
  //   onTerminalResize?: (cols: number, rows: number) => void, 
  //   onTerminalReady?: (terminal: ITerminal) => void, element: HTMLElement}

  // export interface ITerminal {
  //   readonly cols?: number;
  //   readonly rows?: number;
  
  //   reset: () => void;
  //   write: (data: string) => void;
  //   onData: (cb: (data: string) => void) => void;
  // }
  