import { ActionRunner, ArtifactUpdateState } from "../../stores/workbench";
import { IAttachment } from "../../Attachment";
import { ActionState } from "./action";

export type ActionType = 'file' | 'shell';

export interface BaseAction {
  content: string;
}

export interface FileAction extends BaseAction {
  type: 'file';
  filePath: string;
}

export interface ShellAction extends BaseAction {
  type: 'shell';
}

export type BoltAction = FileAction | ShellAction;

export type BoltActionData = BoltAction | BaseAction;


export interface BoltArtifactData {
  id: string;
  title: string;
}


export enum IMsgType{
  User,
  System
}

export interface ArtifactState {
  id: string;
  title: string;
  closed: boolean;
  runner: ActionRunner
  setUpdateView:(updateView: ()=>void)=>void
  updateView: ()=>void
  update:(state:Partial<ArtifactUpdateState>)=>void
  getRunningCommands: ()=>ActionState[]
  getRunnedCommands: ()=>ActionState[]
}

export type Artifacts = Record<string, ArtifactState>;




export interface IUserMessage{
  id: string
  type: IMsgType.User,
  role: SystemRole.user
  user:{
      logo: string
  },
  attachments: IAttachment[]
  prompt: string
}

export enum SystemRole{
  system = 'system',
  user = 'user',
  assistant = 'assistant',
  function = 'function',
  data = 'data',
  tool = 'tool'
}
type JSONValue = null | string | number | boolean | {
  [value: string]: JSONValue;
} | Array<JSONValue>;

export interface ISystemMessage{
  id: string
  type: IMsgType.System,
  role: SystemRole
  createdAt?: Date
  content: string
}


export type IMessage = IUserMessage | ISystemMessage