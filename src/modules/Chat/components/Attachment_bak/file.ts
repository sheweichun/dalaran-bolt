import { UploadImgUrl } from '../../../../api/index';
import axios from 'axios';


const MIME_EXT_MAP = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/png': 'png',
    'image/tiff': 'tif',
}

export const input_accept = Object.keys(MIME_EXT_MAP).join(',')


function getMimeTypeFromBase64(base64String: string) {
    // 检查字符串是否以 'data:' 开头
    if (!base64String.startsWith('data:')) {
        throw new Error('Invalid Base64 string format');
    }
    
    // 提取 MIMI 类型
    const mimeType = base64String.substring(5, base64String.indexOf(';'));
    
    return {
        mimeType,
        ext: MIME_EXT_MAP[mimeType] || 'png'
    };
}


function base64ToBlob(base64, mimeType) {
    // 解码Base64字符串
    const byteString = atob(base64.split(',')[1]);
    
    // 创建一个ArrayBuffer并写入二进制数据
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    // 创建并返回Blob对象
    return new Blob([uint8Array], { type: mimeType });
}



export async function uploadBase64Img(base64String: string, dirname?: string){
    const {ext, mimeType} = getMimeTypeFromBase64(base64String)
    // axiosGet(UploadImgUrl, {extName: ext, dir: dirname  || 'dalaran'})
    const resp:any = await axios.get(`${UploadImgUrl}?extName=${ext}&dir=${dirname  || 'dalaran'}`);
    // console.log('in uploadBase64Img resp: ', resp);
    const { uploadUrl, headers } = resp.data
    const urlObj = new URL(uploadUrl);
	urlObj.protocol = 'https';
    const fetchResp = await fetch(urlObj.toString(), {
        method: headers.method,
        headers: new Headers({ 'Content-Type': headers["Content-Type"] }),
        body: base64ToBlob(base64String, mimeType),
    })
    // console.log('in uploadBase64Img fetchResp: ', fetchResp);
    const u = new URL(fetchResp.url);
    return `${u.protocol}//${u.host}${u.pathname}`
}

export async function uploadFile(file:any, dirname?: string){
    const [extName] = file.name.split('.').slice(-1); // 拓展名
    const resp:any = await axios.get(`${UploadImgUrl}?extName=${extName}&dir=${dirname  || 'dalaran'}`);
    const { uploadUrl, headers } = resp.data
    const urlObj = new URL(uploadUrl);
	urlObj.protocol = 'https';
    const fetchResp = await fetch(urlObj.toString(), {
        method: headers.method,
        headers: new Headers({ 'Content-Type': headers["Content-Type"] }),
        body: new Blob([file], { type: headers.mimeType }),
    })
    const u = new URL(fetchResp.url);
    return `${u.protocol}//${u.host}${u.pathname}`
}