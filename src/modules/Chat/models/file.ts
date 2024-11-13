import { BLACK_FILE_MAP } from "../api/promts/app";

export interface File {
    type: 'file';
    content: string;
    isBinary: boolean;
    modified?: boolean;
    scroll?: number;
  }
  
  export interface Folder {
    type: 'folder';
  }
  
export type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;

export const WORK_DIR = '/home/project'


export function userPath2SystemPath(filePath: string){
  return filePath.replace(`${WORK_DIR}/`, '')
}

export function dirname(pathname: string){
  const dir = pathname.replace(/\/[^/]+$/, '')
  if(dir === pathname) return '.'
  return dir
}


export function getFileName(pathname: string){
  const regex = /[^\\/]+$/;
  const match = pathname.match(regex);
  if (match) {
      return match[0];
  } else {
      return null;
  }
}

export function joinPath(dirName: string, fileName: string){
  if(dirName === '.'){
    return fileName
  }else{
    return `${dirName}/${fileName}`
  }
}


export function transform2FileMap(files: Record<string, string>){
  return Object.keys(files).filter((name)=>!BLACK_FILE_MAP[name]).reduce((ret, name)=>{
    ret[`${WORK_DIR}/${name}`] = {
      type: 'file',
      isBinary: false,
      content: files[name]
    }
    return ret
  }, {} as FileMap)
}


export function FileMap2Record(fileMap: FileMap){
  return Object.keys(fileMap).reduce((ret, name)=>{
    // ret[`${WORK_DIR}/${name}`] = {
    //   type: 'file',
    //   isBinary: false,
    //   content: files[name]
    // }
    const item = fileMap[name]
    const fileName = name.replace(`${WORK_DIR}/`, '')
    if(BLACK_FILE_MAP[fileName] || !item || item.type !== 'file') return ret
    const { content } = item as File
    ret[fileName] = content
    return ret
  }, {} as Record<string, string>)
}