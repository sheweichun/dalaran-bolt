export default `I'll create a beautiful, modern Hello World page with a Chinese aesthetic.

<dalaranPage id="chinese-hello-world" title="Modern Chinese-styled Hello World">
<dalaranAction type="file" filePath="src/App.tsx">import { Globe2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Globe2 className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800">你好，世界！</h1>
          <p className="text-2xl text-gray-600">Hello, World!</p>
          
          <div className="w-full border-t border-red-100 my-4"></div>
          
          <p className="text-gray-500 text-center">
            欢迎来到我的网站
            <br />
            Welcome to my website
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;</dalaranAction>
<dalaranAction type="file" filePath="index.html"><!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>你好，世界！- Hello World</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</dalaranAction>
<dalaranAction type="shell">
<command>npm run dev</command>
</dalaranAction>
</dalaranPage>

I've created a modern, minimalist Hello World page with Chinese characteristics:
- Red color scheme (traditional Chinese lucky color)
- Elegant typography with both Chinese and English text
- Smooth hover animation
- Globe icon representing worldwide connection
- Responsive design that works on all devices

The development server is now running with the updated page.`