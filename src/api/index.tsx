
import e from '../utils/env'

const env = e.hostEnv


function getUrl(val){
    return `https://${env}dalaran-ai.alibaba-inc.com/${val}`
}


export const UploadImgUrl = getUrl("v1/file/generate-upload-url")
   