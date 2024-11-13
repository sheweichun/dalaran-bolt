
import { DirEnt, FileSystemTree, IFSWatcher, WebContainer, WebContainerProcess } from '@webcontainer/api';
// import { Terminal } from '@xterm/xterm'
// import { FitAddon } from '@xterm/addon-fit';
import { SHELL_ERROR_CHAR, SHELL_ERROR_FLAG } from '../../../../utils/constant'
import { ITerminal } from '../Workbench/types';
import { ActionState } from '../MessageList/types/action';
import { bufferWatchEvents } from './fs';
import { Dirent, FileMap, WORK_DIR, File, userPath2SystemPath, dirname, joinPath, getFileName } from '../../models/file';

export const HOME_NAME = 'dalaran'

export const HOME_DIR = `/home/${HOME_NAME}`

export enum FILE_OPR_TYPE {
    ADD = 'add',
    UPDATE = 'update',
    DELETE = 'delete'
}
function fileMap2FileOpr(fileMap: FileMap){
    return  Object.keys(fileMap).map((name)=>{
        const item = fileMap[name]
        if(item && item.type === 'file'){
            return {
                type: FILE_OPR_TYPE.ADD,
                fileName: name,
                content: item
            }
        }
        return undefined
    })
}

function getDirectory(nameList: string[], treeItem: Record<string, any> = {}){
    if(nameList.length < 1) return treeItem
    let target = treeItem;
    for(let i = 0; i < nameList.length; i++){
        const curVal = nameList[i]
        if(!target[curVal]){
            target[curVal] = {
                directory : {}
            }
        }
        target = target[curVal].directory
    }
    return target
}


function map2Tree(fileMap: FileMap, dir?: string){
    const treeFile = {}
    Object.keys(fileMap).forEach((fileName)=>{
        let name = fileName
        if(dir){
            name = fileName.replace(dir, '')
        }
        const item = fileMap[fileName]
        const nameList = name.split('/')
        // console.log('name: ', fileName, nameList, name);
        const newFileName = nameList[nameList.length - 1]
        const targetDirectory = getDirectory(nameList.slice(0, nameList.length - 1), treeFile)
        if(targetDirectory && item){
            targetDirectory[newFileName] = {
                file:{
                    contents: (item as File).content
                }
            }
        }
    })
    return treeFile
}

export interface FileOpr{
    type: FILE_OPR_TYPE
    fileName: string
    content?: Dirent | undefined
}

export class CAIWebContainer{
    private _instance: WebContainer | undefined
    private _terminals: Array<{ terminal: ITerminal; process?: WebContainerProcess }> = [];
    private _loaded: boolean = false
    private _isLoading: boolean = false
    private _resolves: Array<(WebContainer)=>void> = []
    private _rejects: Array<(reason?: any)=>void> = []
    private _mounted : boolean = false
    private _fsWatcher ?: IFSWatcher

    private _mountFileMap?: FileMap

    private _hasInitFileTreeView?: boolean

    private _updatePreviewUrl?: (url: string)=>void
    private _updateFileMap?: (oprs: (FileOpr | undefined)[])=>void
    constructor(){
        this.onServerReady = this.onServerReady.bind(this)
        this._fsWatchCallback = this._fsWatchCallback.bind(this)
    }
    checkInstance(){
        if(!this._instance) throw new Error('WebContainer is not booted')
    }
    private _load(): Promise<WebContainer>{
        //@ts-ignore
        if(WebContainer._instance) return Promise.resolve(WebContainer._instance)
        return new Promise<WebContainer>(async(resolve, reject)=>{
            this._resolves.push(resolve)
            this._rejects.push(reject)
            if(this._isLoading){
                return
            }
            this._isLoading = true
            try{
                const inst = await WebContainer.boot({
                    workdirName: HOME_NAME
                })
                this._loaded = true
                this._resolves.forEach((_resolve)=>{
                    _resolve(inst)
                })
            }catch(e){
                this._rejects.forEach((_reject)=>{
                    _reject(e)
                })
            }
        })
    }
    async bootstrap(){
        const instance = await this._load()
        // await this.mount({})
        instance.on('server-ready', this.onServerReady);
    }
    async getInstance(){
        if(this._instance) return this._instance
        const instance = await this._load();
        this._instance = instance
        return instance
    }
    onServerReady(port: number, url: string){
        // console.log('in onServerReady :', url);
        this._updatePreviewUrl && this._updatePreviewUrl(url)
        // const intance = await this.getInstance()
        // intance.on('server-ready', cb);
    }
    async mount(files: FileMap){
        if(this._mounted) return
        // console.log('in mount:', files);
        this._mountFileMap = files
        if(!this._hasInitFileTreeView && this._updateFileMap){
            // console.log('in mount _updateFileMap :', this._updateFileMap, files);
            this._hasInitFileTreeView = true
            const fileOprs:(FileOpr | undefined)[] = fileMap2FileOpr(files)
            this._updateFileMap(fileOprs)
        }
        this._mounted = true
        const intance = await this.getInstance()
        const fileTree: FileSystemTree = map2Tree(files, `${WORK_DIR}/`)
        await intance.mount(fileTree);
        // this._fsWatcher = intance.fs.watch(`/`, {recursive: true}, )
        await this._bindFsWatch()
        return this
    }

    public setUpdateFileMapHandler(handler: (oprs: (FileOpr | undefined)[])=>void){
        // console.log('in setUpdateFileMapHandler:', handler);
        this._updateFileMap = handler
        const { _mountFileMap} = this
        if(!this._hasInitFileTreeView && _mountFileMap){
            // handler()
            this._hasInitFileTreeView = true
            // console.log('in setUpdateFileMapHandler _updateFileMap :', this._updateFileMap, _mountFileMap);
            const fileOprs:(FileOpr | undefined)[] = fileMap2FileOpr(_mountFileMap)
            handler(fileOprs)
            this._mountFileMap = undefined
        }
    }

    private async _bindFsWatch(){
        if(this._fsWatcher) return
        const intance = await this.getInstance()
        this._fsWatcher = intance.fs.watch(`/`, {recursive: true}, bufferWatchEvents<string[]>(100, this._fsWatchCallback))
    }

    private async _unbindFsWatch(){
        this._fsWatcher?.close()
        this._fsWatcher = undefined
    }

    async systemWriteFile(filePath: string, content: string){
        const intance = await this.getInstance()
        await this._unbindFsWatch()
        await intance.fs.writeFile(userPath2SystemPath(filePath), content)
        await this._bindFsWatch()
    }

    private async _fsWatchCallback(args){
        // console.log('args :', args);
        const intance = await this.getInstance()
        const oprs: FileOpr[] = []
        const promiseList = args.map(async(arg)=>{
            const [ event, fullPath ] = arg
            if(/node_modules|package-lock\.json/.test(fullPath as string)){
                return
            }
            // console.log('arg :', arg);
            const fsInstance = intance.fs
            if(event === 'change'){
                const content: string = await fsInstance.readFile(fullPath, 'utf-8')
                oprs.push({
                    type: FILE_OPR_TYPE.ADD,
                    fileName : `${WORK_DIR}/${fullPath}`,
                    content:{
                        type: 'file',
                        content,
                        isBinary: false
                    }
                })
            }else{ //rename
                const dirName = dirname(fullPath)
                const relFileName = getFileName(fullPath)
                let fileList:DirEnt<string>[] = []
                // console.log('dirName :', dirName, relFileName, fullPath);
                try{
                    fileList = await fsInstance.readdir(dirName, {
                        withFileTypes: true
                    })
                }catch(e){
                    oprs.push({
                        type: FILE_OPR_TYPE.DELETE,
                        fileName : `${WORK_DIR}/${fullPath}`
                    })
                    return //目录删除，触发目录下的子文件和目录删除
                }
                
                const filterList = fileList.filter((item)=>{
                    return relFileName === item.name
                })
                const targetItem = filterList[0];
                let oprContent: Dirent | undefined
                // console.log('fileList :', fileList, filterList, relFileName, dirName);
                if(targetItem){ //新增或更新操作
                    // console.log('targetItem :', targetItem.isDirectory());
                    if(targetItem.isDirectory()){
                        oprContent = {
                            type: 'folder'
                        }
                    }else{
                        const fileContent = await fsInstance.readFile(fullPath, 'utf-8')
                        oprContent = {
                            type: 'file',
                            content: fileContent,
                            isBinary: false
                        }
                    }
                    oprs.push({
                        type: FILE_OPR_TYPE.ADD,
                        fileName : `${WORK_DIR}/${fullPath}`,
                        content: oprContent
                    })
                }else{ //删除操作
                    oprs.push({
                        type: FILE_OPR_TYPE.DELETE,
                        fileName : `${WORK_DIR}/${fullPath}`
                    })
                }
            }
            // console.log('swc file changed', event, fullPath);
        })
        await Promise.all(promiseList)
        // console.log('oprs :', oprs);
        this._updateFileMap && this._updateFileMap(oprs)
    }

    activateTerminal(terminal: ITerminal, shellProcess?: WebContainerProcess){
        // console.log('go here!!');
        this._terminals.push({ terminal, process: shellProcess });
    }
    async runShell(action: ActionState){
        const runTerminal = this._terminals[0];
        // console.log('_terminals:',runTerminal);
        const instance = await this.getInstance()
        const process = await instance.spawn('jsh', ['-c', action.content], {
            env: { npm_config_yes: true },
        });
        action.abortSignal.addEventListener('abort', () => {
            process.kill();
        });
        let proceeOutput = ''
        process.output.pipeTo(
            new WritableStream({
                write(data) {
                    proceeOutput += data
                    runTerminal.terminal.write(data)
                },
            }),
        );
        const exitCode = await process.exit;
        // console.log('in run shell exitCode :', exitCode);
        if (exitCode !== 0) {
            throw new Error(`${SHELL_ERROR_FLAG}${proceeOutput}`);
        };
        
    }
    
    public setUpdatePreviewUrl(handler: (url: string)=>void){
        this._updatePreviewUrl = handler
    }
    // async runApp(cb: (port: number, url: string)=>void){
    //     const runTerminal = this._terminals[0];
    //     // console.log('_terminals:',runTerminal);
    //     const instance = await this.getInstance()
    //     const installProcess = await instance.spawn('npm', ['install']);
    //     // Wait for install command to exit
    //     installProcess.output.pipeTo(new WritableStream({
    //         write(data) {
    //             runTerminal.terminal.write(data)
    //         }
    //     }));
    //     const exitCode = await installProcess.exit
    //     if (exitCode !== 0) {
    //       throw new Error('Installation failed');
    //     };
    //     const serverProcess = await instance.spawn('npm', ['run', 'dev']);
    //     serverProcess.output.pipeTo(
    //         new WritableStream({
    //         write(data) {
    //             runTerminal.terminal.write(data);
    //         },
    //         })
    //     );
    //     instance.on('server-ready', cb);
    // }
    async getFileSystem(){
        const instance = await this.getInstance()
        return instance.fs
    }
    dispose(){
        this._fsWatcher?.close()
    }
    // listen(cb: (port: number, url: string) => void){
    //     this.checkInstance()
    //     this._instance!.on('server-ready', cb);
    // }
    // async devServer(cb: (port: number, url: string) => void) {
    //     const terminal = this._terminal
    //     this.checkInstance()
    //     const instance = this._instance!
    //     const serverProcess = await instance.spawn('npm', ['run', 'dev']);
    //     serverProcess.output.pipeTo(
    //         new WritableStream({
    //         write(data) {
    //             terminal.write(data);
    //         },
    //         })
    //     );
    //     instance!.on('server-ready', cb);

    // }
    // async installDependencies(){
    //     this.checkInstance()
    //     const terminal = this._terminal
    //     const instance = this._instance!
    //     const installProcess = await instance.spawn('npm', ['install']);
    //     // Wait for install command to exit
    //     installProcess.output.pipeTo(new WritableStream({
    //         write(data) {
    //             terminal.write(data)
    //         }
    //     }));
    //     const exitCode = await installProcess.exit
    //     if (exitCode !== 0) {
    //       throw new Error('Installation failed');
    //     };
    // }
}

const WebContainerInstance = new CAIWebContainer()
WebContainerInstance.bootstrap()
//@ts-ignore
window.$webcontainer = WebContainerInstance
export default WebContainerInstance