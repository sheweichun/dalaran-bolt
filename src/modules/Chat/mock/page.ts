
export const TEMPLATE_FILES = {
    id: 'myProject',
    files: {
    ".dalaran/prompt": "对于我要求你制作的所有设计，请确保它们美观，而不是千篇一律。创建功能完整且适合生产环境的网页。\n\n此模板默认支持 JSX 语法与 Tailwind CSS 类，React hooks。除非绝对必要或我主动要求，否则请勿安装其他UI主题、图标等包\n",
    ".gitignore": "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n",
    "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <meta charset=\"utf-8\"/>\n        <link rel=\"icon\" href=\"data:;base64,=\"/>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"/>\n        <meta name=\"theme-color\" content=\"#000000\"/>\n        <link crossorigin=\"anonymous\" id=\"@alife/theme-sellerpc\" rel=\"stylesheet\" type=\"text/css\" href=\"https://gw.alipayobjects.com/os/lib/alife/theme-sellerpc/0.7.10/??dist/next.min.css,variables.css,dist/next.var.min.css\" />\n        <link crossorigin=\"anonymous\" id=\"iconfont\" rel=\"stylesheet\" type=\"text/css\" href=\"https://at.alicdn.com/t/a/font_1613397_xq36rgmkwnl.css\" />\n        <script crossorigin=\"anonymous\" id=\"react\" src=\"https://g.alicdn.com/code/lib/react/17.0.1/umd/react.development.js\"></script>\n        <script crossorigin=\"anonymous\" id=\"react-dom\" src=\"https://g.alicdn.com/code/lib/react-dom/17.0.1/umd/react-dom.development.js\"></script>\n        <script crossorigin=\"anonymous\" id=\"moment\" src=\"https://g.alicdn.com/code/lib/moment.js/2.27.0/moment-with-locales.min.js\"></script>\n        <script crossorigin=\"anonymous\" id=\"@alife/next\" src=\"https://g.alicdn.com/code/lib/alifd__next/1.25.49/next.min.js\"></script>\n        <script crossorigin=\"anonymous\" id=\"react-router-dom\" src=\"https://gw.alipayobjects.com/os/lib/react-router-dom/5.2.0/umd/react-router-dom.min.js\"></script>\n        <!-- <script crossorigin=\"anonymous\" id=\"\" src=\"https://g.alicdn.com/mtb/lib-mtop/2.6.1/mtop.js\"></script> -->\n        <script>\n            window.$QMSMicroMods = {};\n        </script>\n        <title>Merchant Material devServer</title>\n    </head>\n    <body>\n        <div id=\"ai-chat\"></div>\n        <div id='icestark-container'></div>\n        <div id='root'></div>\n        <script type=\"module\" src=\"/src/main.tsx\"></script>\n    </body>\n</html>\n",
    "package.json": "{\n  \"name\": \"my-project\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"devDependencies\": {\n    \"@types/react\": \"^17.0.1\",\n    \"@types/react-dom\": \"^17.0.1\",\n    \"@vitejs/plugin-react\": \"^4.3.1\",\n    \"autoprefixer\": \"^10.4.18\",\n    \"postcss\": \"^8.4.35\",\n    \"tailwindcss\": \"^3.4.1\",\n    \"rollup-plugin-external-globals\": \"^0.12.0\",\n    \"vite\": \"^5.4.2\"\n  }\n}\n\n",
    "postcss.config.js": "export default {\n    plugins: {\n        tailwindcss: {},\n        autoprefixer: {}\n    }\n};",
    "src/App.tsx": "import React from 'react';\n\n\nfunction App() {\n    return (\n    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n        <p>开始提示（或编辑）以见证奇迹发生 :)</p>\n    </div>\n    );\n}\n\nexport default App",
    "src/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* #root{\n    height: 100vw;\n    width: 100%;\n} */",
    "src/main.tsx": "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App.tsx';\nimport './index.css';\n\nReactDOM.render(<App />, document.getElementById('root'))\n\n",
    "src/vite-env.d.ts": "/// <reference types=\"vite/client\" />\n",
    "tailwind.config.js": "/** @type {import('tailwindcss').Config} */\nexport default {\n    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n    theme: {\n        extend: {},\n    },\n    plugins: [],\n};\n",
    "tsconfig.app.json": "{\n    \"compilerOptions\": {\n        \"target\": \"ES2020\",\n        \"useDefineForClassFields\": true,\n        \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],\n        \"module\": \"ESNext\",\n        \"skipLibCheck\": true,\n        /* Bundler mode */\n        \"moduleResolution\": \"bundler\",\n        \"allowImportingTsExtensions\": true,\n        \"isolatedModules\": true,\n        \"moduleDetection\": \"force\",\n        \"noEmit\": true,\n        \"jsx\": \"react-jsx\",\n        /* Linting */\n        \"strict\": true,\n        \"noUnusedLocals\": true,\n        \"noUnusedParameters\": true,\n        \"noFallthroughCasesInSwitch\": true\n    },\n    \"include\": [\"src\"]\n}",
    "tsconfig.json": "{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./tsconfig.app.json\" },\n    { \"path\": \"./tsconfig.node.json\" }\n  ]\n}\n",
    "tsconfig.node.json": "{\n    \"compilerOptions\": {\n        \"target\": \"ES2022\",\n        \"lib\": [\"ES2023\"],\n        \"module\": \"ESNext\",\n        \"skipLibCheck\": true,\n        /* Bundler mode */\n        \"moduleResolution\": \"bundler\",\n        \"allowImportingTsExtensions\": true,\n        \"isolatedModules\": true,\n        \"moduleDetection\": \"force\",\n        \"noEmit\": true,\n        /* Linting */\n        \"strict\": true,\n        \"noUnusedLocals\": true,\n        \"noUnusedParameters\": true,\n        \"noFallthroughCasesInSwitch\": true\n    },\n    \"include\": [\"vite.config.ts\"]\n}",
    "vite.config.ts": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport externalGlobals from \"rollup-plugin-external-globals\";\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [\n    react({\n      jsxRuntime: 'classic'\n    }),\n    externalGlobals({\n      react: 'React',\n      'react-dom': 'ReactDOM',\n      moment: 'moment',\n      'react-router-dom': 'ReactRouterDOM',\n      '@alife/next': 'Next',\n      '@alifd/next': 'Next'\n    })\n  ]\n});\n"
}
}