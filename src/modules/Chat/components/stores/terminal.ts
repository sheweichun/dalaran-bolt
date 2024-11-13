import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal as XTerm } from '@xterm/xterm';
import type { ITerminal } from '../Workbench/types/index';
import { newShellProcess } from '../Workbench/Terminal/shell';
import { Terminal } from '@xterm/xterm';
import { getTerminalTheme } from '../Workbench/Terminal/theme';
import { CAIWebContainer } from './webcontainer';


const reset = '\x1b[0m';

export const escapeCodes = {
  reset,
  clear: '\x1b[g',
  red: '\x1b[1;31m',
};

export const coloredText = {
  red: (text: string) => `${escapeCodes.red}${text}${reset}`,
};

export interface ITerminalOption{
    readonly?: boolean
    name: string,
    icon: string,
    canDelete?: boolean
    style?: any
    webcontainer: CAIWebContainer
}

export class TerminalInst implements ITerminal{
    public name: string;
    public icon: string
    public canDelete?: boolean
    public style?: any
    private _webcontainer: CAIWebContainer
    private _isReady: boolean = false
    private _instance: Terminal
    private _fitAddon: FitAddon
    private _shellProcess?: WebContainerProcess
    private _resizeObserver?: ResizeObserver
    private _readonly: boolean
    private _cacheText: string = ''
    // private _option: ITerminalOption
    static create(data: ITerminalOption[]){
        return data.map((option)=>{
            return new TerminalInst(option)
        })
    }
    constructor(option:ITerminalOption
    ){
      const {readonly, webcontainer, name, icon, canDelete, style} = option
    //   this._option = option || {}
      this._readonly = !!readonly
      this._webcontainer = webcontainer
      this.name = name
      this.icon = icon
      this.canDelete = canDelete
      this.style = style
      this._init(readonly)
    }
    private _init(readonly?: boolean){
      const fitAddon = new FitAddon();
      this._fitAddon = fitAddon
      const webLinksAddon = new WebLinksAddon();
      const terminal = new XTerm({
        cursorBlink: true,
        convertEol: true,
        disableStdin: readonly,
        theme: getTerminalTheme(readonly ? { cursor: '#00000000' } : {}),
        fontSize: 12,
        fontFamily: 'Menlo, courier-new, courier, monospace',
      });
   
      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);
      this._instance = terminal
    }
  //   updateOption(){
  //  // terminal.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});

  //     // terminal.options.disableStdin = readonly;
  //   }
    async onTerminalDOMReady(element: HTMLElement){
        if(this._isReady) return
        const terminal = this._instance
        terminal.open(element)
        this._isReady = true
        if(!this._readonly){
          try {
            const intance = await this._webcontainer.getInstance()
            const shellProcess = await newShellProcess(intance, this);
            this._shellProcess = shellProcess
            this._webcontainer.activateTerminal(this, shellProcess)
          } catch (error: any) {
            terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
            return;
          }
          const resizeObserver = new ResizeObserver(() => {
              this._fitAddon.fit();
              if(this._shellProcess){
                  this._shellProcess.resize({cols: terminal.cols, rows:terminal.rows});
              }
          });

          resizeObserver.observe(element);
          this._resizeObserver = resizeObserver
        }else{
          this._webcontainer.activateTerminal(this)
        }
        
        // console.log('Attach terminal');
    }
    reset(){
        this._instance.reset()
    }  
    write(text: string){
        if(!this._isReady){
          this._cacheText += text
          return 
        }
        if(this._cacheText){
          this._instance.write(this._cacheText)
          this._cacheText = ''
        }
      // console.log('text :', text);
        this._instance.write(text)
    }
    onData(cb: (data: string) => void){
        this._instance.onData(cb)
    }
    dispose(){
        this._instance.dispose()
        this._resizeObserver && this._resizeObserver.disconnect()
    }
}

// export class TerminalStore {
//   private _webcontainer: Promise<WebContainer>;
//   private _terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];

//   showTerminal: WritableAtom<boolean> = import.meta.hot?.data.showTerminal ?? atom(false);

//   constructor(webcontainerPromise: Promise<WebContainer>) {
//     this.#webcontainer = webcontainerPromise;

//     if (import.meta.hot) {
//       import.meta.hot.data.showTerminal = this.showTerminal;
//     }
//   }

//   toggleTerminal(value?: boolean) {
//     this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
//   }

//   async attachTerminal(terminal: ITerminal) {
//     try {
//       const shellProcess = await newShellProcess(await this.#webcontainer, terminal);
//       this.#terminals.push({ terminal, process: shellProcess });
//     } catch (error: any) {
//       terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
//       return;
//     }
//   }

//   onTerminalResize(cols: number, rows: number) {
//     for (const { process } of this.#terminals) {
//       process.resize({ cols, rows });
//     }
//   }
// }
