## 使用文档





## 脚手架适配

scripts/webpackDevServer.config.js中需要配置服务头
```json
headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
},
```

scripts/template.html中的script和link标签需要加上 crossorigin="anonymous"