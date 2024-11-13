// import { TEMPLATE_FILES } from "../../mock/page"


export const BLACK_FILE_MAP = {
    '.gitignore': true,
    '.dalaran/prompt': true
}


// export function getMountAppFiles(appFiles: Record<string, string>){
//     return Object.keys(appFiles).filter((name)=>!BLACK_FILE_MAP[name]).reduce((acc, name)=>{
//         acc[name] = appFiles[name]
//         return acc
//     }, {})
// }

// 运行前请务必运行\`npm install\`来安装所有依赖，然后运行\`npm run dev\`来启动项目。

export function getAppPrompt(appFiles: Record<string, string>){
    let prompt = `这是一个包含项目所有文件的页面，可供您查看。
请考虑项目中所有文件的内容
<dalaranPage id="project-import" title="项目当前文件列表">
${Object.keys(appFiles).filter((name)=>!BLACK_FILE_MAP[name]).map((name)=>{
    return `<dalaranAction type="file" filePath="${name}">${appFiles[name]}</dalaranAction>`
})}
</dalaranPage>
以下是存在于文件系统中但未显示给您的文件列表：
${Object.keys(BLACK_FILE_MAP).join('\n')}
`
    return {
        "role": "user",
        "content": prompt
        // "content": [
        //     {
        //         "type": "text",
        //         "text": prompt,
        //         "experimental_providerMetadata": {
        //             "anthropic": {
        //                 "cacheControl": {
        //                     "type": "ephemeral"
        //                 }
        //             }
        //         }
        //     }
        // ]
    }
}