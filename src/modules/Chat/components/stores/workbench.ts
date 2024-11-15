import { SHELL_ERROR_CHAR, SHELL_ERROR_FLAG } from "../../../../utils/constant";
import { dirname } from "../../models/file";
import { ActionCallbackData } from "../MessageList/hooks/messageParser";
import { Artifacts, ArtifactState, BoltArtifactData } from "../MessageList/types";
import { ActionsMap, ActionState, ActionStateUpdate } from "../MessageList/types/action";
import WebContainerInstance from "./webcontainer";


interface ArtifactCallbackData extends BoltArtifactData {
    messageId: string;
  }

// function dirname(pathname: string){
//   const dir = pathname.replace(/\/[^/]+$/, '')
//   if(dir === pathname) return '.'
//   return dir
// }

class ArtifactItem implements ArtifactState{
    id: string;
    title: string;
    closed: boolean;
    runner: ActionRunner
    _updateView?: ()=>void
    // private _errorMsgInfo: {
    //   message: string
    //   command: string
    // }[] = []
    constructor(id: string, title: string){
        this.id = id;
        this.title = title;
        this.closed = false;
        this.runner = new ActionRunner(this);
        this.updateView = this.updateView.bind(this)
    }
    getRunnedCommands(){
      const { actions } = this.runner
      return Object.keys(actions).map((name)=>actions[name]).filter(item=>item.status === 'complete')
    }
    getRunningCommands(){
      const { actions } = this.runner
      return Object.keys(actions).map((name)=>actions[name]).filter(item=>item.status === 'running')
    }
    update(state:Partial<ArtifactUpdateState>, onComplate?: ()=>void){
      if(!state) return
      if(state.title != undefined){
        this.title = state.title
      }
      if(state.closed != undefined){
        this.closed = state.closed
      }
      this.runner.onComplete(()=>{
        onComplate && onComplate()
        this.updateView()
      })
    }
    setUpdateView(updateView: ()=>void){
        this._updateView = updateView;
    }
    updateView(){
      this._updateView && this._updateView()
    }
    // pushErrorInfo(cmd: string, errMessage: string){
    //   this._errorMsgInfo.push({
    //     command: cmd,
    //     message: errMessage
    //   })
    // }
}


export type ArtifactUpdateState = Pick<ArtifactState, 'title' | 'closed'>;
class _WorkbenchStore{
    artifacts: Artifacts = {};
    artifactIdList: string[] = [];
    curArtifactId: string | undefined;
    // private _getArtifact(id: string): ArtifactState | undefined | vo
    private _getArtifact(id?: string){
        const artifacts = this.artifacts;
        return artifacts[id || ''];
    }
    // getArtifact(id: string){
    //   return this._getArtifact(id)
    // }
    onBugFix(errorList: {cmd: string, error: string}[]){

    }
    getCurArtifact(){
      return this._getArtifact(this.curArtifactId)
    }
    getCommandPrompt(){
      const { artifacts } = this
      const runingCommandList: string[] = [], runnedCommandList: string[] = []
      Object.keys(this.artifacts).forEach((id)=>{
        const artifact = artifacts[id]
        const runningCommand = artifact.getRunningCommands()
        const runnedCommand = artifact.getRunnedCommands()
        runingCommandList.push(...runningCommand.map(item=>item.content))
        runnedCommandList.push(...runnedCommand.map(item=>item.content))
      })
      return `<runningCommand>${runingCommandList.join('\n')}</runningCommand><runnedCommand>${runnedCommandList.join('\n')}</runnedCommand>`
    }
    addArtifact({ title, id }: ArtifactCallbackData) {
        const artifact = this._getArtifact(id);

        if (artifact) {
            return;
        }

        if (!this.artifactIdList.includes(id)) {
            this.artifactIdList.push(id);
        }
        this.artifacts[id] = new ArtifactItem(id, title);
        this.curArtifactId = id
    }
    updateArtifact({ id }: ArtifactCallbackData, state: Partial<ArtifactUpdateState>) {
        const artifact = this._getArtifact(id);

        if (!artifact) {
            return;
        }

        artifact.update(state);
    }
    async addAction(data: ActionCallbackData) {
        const { artifactId } = data;
        const artifact = this._getArtifact(artifactId);

        if (!artifact) {
            throw new Error('Artifact not found');
        }

        artifact.runner.addAction(data);
        artifact.updateView()
    }
    runAction(data: ActionCallbackData) {
      const { artifactId } = data;
  
      const artifact = this._getArtifact(artifactId);
  
      if (!artifact) {
        throw new Error('Artifact not found');
      }
  
      artifact.runner.runAction(data);
    }
}


export class ActionRunner {
    // #webcontainer: Promise<WebContainer>;
    _currentExecutionPromise: Promise<void> = Promise.resolve();
  
    actions: ActionsMap = {};
  
    constructor(private _ArtifactItem: ArtifactItem) {
    //   this.#webcontainer = webcontainerPromise;
    }


    onComplete(cb: ()=>void){
      this._currentExecutionPromise.finally(cb)
    }
    // getErrorAction(){
    //   let errorList:{cmd: string, errMsg: string}[] = []
    //   Object.keys(this.actions).forEach((name)=>{
    //     const item = this.actions[name]
    //     if(item.status === 'failed'){
    //       errorList.push({
    //         cmd: item.content,
    //         errMsg: item.error
    //       })
    //     }
    //   })
    //   return errorList
    // }
    _updateAction(id: string, newState: ActionStateUpdate) {
        const actions = this.actions;

        this.actions[id] = { ...actions[id], ...newState };
    }
  
    addAction(data: ActionCallbackData) {
      const _this = this
      const { actionId } = data;
  
      const actions = this.actions;
      const action = actions[actionId];
  
      if (action) {
        // action already added
        return;
      }
  
      const abortController = new AbortController();
      this.actions[actionId] = {
        ...data.action,
        status: 'pending',
        executed: false,
        abort: () => {
          abortController.abort();
          _this._updateAction(actionId, { status: 'aborted' });
        },
        abortSignal: abortController.signal,
      };
  
      this._currentExecutionPromise.then(() => {
        this._updateAction(actionId, { status: 'running' });
        this._ArtifactItem.updateView()
      });
    }
  

    private async _executeAction(actionId: string) {
      const action = this.actions[actionId];
  
      this._updateAction(actionId, { status: 'running' });
      this._ArtifactItem.updateView()
      try {
        switch (action.type) {
          case 'shell': {
            await this._runShellAction(action);
            break;
          }
          case 'file': {
            await this._runFileAction(action);
            break;
          }
        }
        this._updateAction(actionId, { status: action.abortSignal.aborted ? 'aborted' : 'complete' });
      } catch (error) {
        const msgList  = error.message.split(SHELL_ERROR_FLAG)
        this._updateAction(actionId, { status: 'failed', error: msgList[1] || '' });
  
        // re-throw the error to be caught in the promise chain
        throw error;
      }
    }

    async _runFileAction(action: ActionState) {

      if (action.type !== 'file') {
        return 
      }
      // console.log('run file action :', action);
      // return


      const webcontainer = await WebContainerInstance.getInstance();
  
      let folder = dirname(action.filePath);
      // remove trailing slashes
      folder = folder.replace(/\/+$/g, '');
      // console.log('go here1');
      if (folder !== '.') {
        try {
          await webcontainer.fs.mkdir(folder, { recursive: true });
          console.log('Created folder', folder);
        } catch (error) {
          console.error('Failed to create folder\n\n', error);
        }
      }
      // console.log('go here2');
      try {
        await webcontainer.fs.writeFile(action.filePath, action.content);
        console.log(`File written ${action.filePath}`);
      } catch (error) {
        console.error('Failed to write file\n\n', error);
      }
    }

    runAction(data: ActionCallbackData) {
      const { actionId } = data;
      const action = this.actions[actionId];
  
      if (!action) {
        throw new Error(`Action ${actionId} not found`);
      }
  
      if (action.executed) {
        return;
      }
  
      this._updateAction(actionId, { ...action, ...data.action, executed: true });
  
      this._currentExecutionPromise = this._currentExecutionPromise
        .then(() => {
          return this._executeAction(actionId);
        })
        .catch((error) => {
          console.error('Action failed:', error.message);
        });
    }
  
    private async _runShellAction(action: ActionState) {
      if (action.type !== 'shell') {
        throw new Error('Expected shell action');
      }
      // return 
      const webcontainer = WebContainerInstance;
  
      return webcontainer.runShell(action)
    }
  
  }
  


const WorkbenchStore = new _WorkbenchStore();
export default WorkbenchStore;