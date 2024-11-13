import { FileMap, WORK_DIR } from "../models/file";


export const MOCK_FILES = {
  "vite.config.ts":`import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
  });
  `
}




// export const MockFileMap: FileMap = {
//     [`${WORK_DIR}/src/main.tsx`]: {
//         type: 'file',
//         content: `import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './App.css'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/src/index.css`]: {
//       type: 'file',
//       content: `:root {
//   font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
//   line-height: 1.5;
//   font-weight: 400;

//   color-scheme: light dark;
//   color: rgba(255, 255, 255, 0.87);
//   background-color: #242424;

//   font-synthesis: none;
//   text-rendering: optimizeLegibility;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }

// a {
//   font-weight: 500;
//   color: #646cff;
//   text-decoration: inherit;
// }
// a:hover {
//   color: #535bf2;
// }

// body {
//   margin: 0;
//   display: flex;
//   place-items: center;
//   min-width: 320px;
//   min-height: 100vh;
// }

// h1 {
//   font-size: 3.2em;
//   line-height: 1.1;
// }

// button {
//   border-radius: 8px;
//   border: 1px solid transparent;
//   padding: 0.6em 1.2em;
//   font-size: 1em;
//   font-weight: 500;
//   font-family: inherit;
//   background-color: #1a1a1a;
//   cursor: pointer;
//   transition: border-color 0.25s;
// }
// button:hover {
//   border-color: #646cff;
// }
// button:focus,
// button:focus-visible {
//   outline: 4px auto -webkit-focus-ring-color;
// }

// @media (prefers-color-scheme: light) {
//   :root {
//     color: #213547;
//     background-color: #ffffff;
//   }
//   a:hover {
//     color: #747bff;
//   }
//   button {
//     background-color: #f9f9f9;
//   }
// }

// `,
//       isBinary: false
//   },
//     [`${WORK_DIR}/src/App.tsx`]: {
//         type: 'file',
//         content: `import React, { useState } from 'react';
// import { PlusCircle, CheckCircle2, Circle, Trash2, Tag } from 'lucide-react';

// interface Todo {
//   id: number;
//   text: string;
//   completed: boolean;
//   category: string;
// }

// function App() {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [input, setInput] = useState('');
//   const [category, setCategory] = useState('personal');

//   const addTodo = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setTodos([
//         ...todos,
//         {
//           id: Date.now(),
//           text: input.trim(),
//           completed: false,
//           category,
//         },
//       ]);
//       setInput('');
//     }
//   };

//   const toggleTodo = (id: number) => {
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, completed: !todo.completed } : todo
//       )
//     );
//   };

//   const deleteTodo = (id: number) => {
//     setTodos(todos.filter((todo) => todo.id !== id));
//   };

//   const categories = ['personal', 'work', 'shopping', 'health'];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
//       <div className="max-w-3xl mx-auto p-6">
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
//             My Tasks
//           </h1>

//           <form onSubmit={addTodo} className="mb-8">
//             <div className="flex gap-4">
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Add a new task..."
//                 className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <button
//                 type="submit"
//                 className="bg-indigo-600 text-white rounded-lg px-6 py-2 hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
//               >
//                 <PlusCircle size={20} />
//                 Add
//               </button>
//             </div>
//           </form>

//           <div className="space-y-4">
//             {todos.map((todo) => (
//               <div
//                 key={todo.id}
//                 className={"group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 bg-white hover:shadow-md"}
//               >
//                 <button
//                   onClick={() => toggleTodo(todo.id)}
//                   className="text-gray-400 hover:text-indigo-600 transition-colors"
//                 >
//                   {todo.completed ? (
//                     <CheckCircle2 className="text-green-500" size={24} />
//                   ) : (
//                     <Circle size={24} />
//                   )}
//                 </button>
//                 <div className="flex-1">
//                   <p
//                     className={'text-gray-800'}
//                   >
//                     {todo.text}
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Tag size={14} className="text-gray-400" />
//                     <span className="text-sm text-gray-500 capitalize">
//                       {todo.category}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => deleteTodo(todo.id)}
//                   className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             ))}
//             {todos.length === 0 && (
//               <div className="text-center text-gray-500 py-8">
//                 <p className="text-lg">No tasks yet. Add one to get started!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/src/App.css`]: {
//       type: 'file',
//       content: `#root {
//   max-width: 1280px;
//   margin: 0 auto;
//   padding: 2rem;
//   text-align: center;
// }

// .logo {
//   height: 6em;
//   padding: 1.5em;
//   will-change: filter;
//   transition: filter 300ms;
// }
// .logo:hover {
//   filter: drop-shadow(0 0 2em #646cffaa);
// }
// .logo.react:hover {
//   filter: drop-shadow(0 0 2em #61dafbaa);
// }

// @keyframes logo-spin {
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }

// @media (prefers-reduced-motion: no-preference) {
//   a:nth-of-type(2) .logo {
//     animation: logo-spin infinite 20s linear;
//   }
// }

// .card {
//   padding: 2em;
// }

// .read-the-docs {
//   color: #888;
// }

// `,
//       isBinary: false
//   },
//     [`${WORK_DIR}/index.html`]: {
//         type: 'file',
//         content: `<!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Vite + React + TS</title>
//   </head>
//   <body>
//     <div id="root"></div>
//     <script type="module" src="/src/main.tsx"></script>
//   </body>
// </html>
// ;
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/package.json`]: {
//         type: 'file',
//         content: `{
//   "name": "vite-react-typescript-starter",
//   "private": true,
//   "version": "0.0.0",
//   "type": "module",
//   "scripts": {
//     "dev": "vite",
//     "build": "vite build",
//     "lint": "eslint .",
//     "preview": "vite preview"
//   },
//   "dependencies": {
//     "lucide-react": "^0.344.0",
//     "react": "^18.3.1",
//     "react-dom": "^18.3.1"
//   },
//   "devDependencies": {
//     "@eslint/js": "^9.9.1",
//     "@types/react": "^18.3.5",
//     "@types/react-dom": "^18.3.0",
//     "@vitejs/plugin-react": "^4.3.1",
//     "autoprefixer": "^10.4.18",
//     "eslint": "^9.9.1",
//     "eslint-plugin-react-hooks": "^5.1.0-rc.0",
//     "eslint-plugin-react-refresh": "^0.4.11",
//     "globals": "^15.9.0",
//     "postcss": "^8.4.35",
//     "tailwindcss": "^3.4.1",
//     "typescript": "^5.5.3",
//     "typescript-eslint": "^8.3.0",
//     "vite": "^5.4.2"
//   }
// }
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/postcss.config.js`]: {
//         type: 'file',
//         content: `export default {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/tailwind.config.js`]: {
//         type: 'file',
//         content: `/** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/vite.config.ts`]: {
//         type: 'file',
//         content: `import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/tsconfig.json`]: {
//         type: 'file',
//         content: `{
//   "files": [],
//   "references": [
//     { "path": "./tsconfig.app.json" },
//     { "path": "./tsconfig.node.json" }
//   ]
// }
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/tsconfig.app.json`]: {
//         type: 'file',
//         content: `{
//   "compilerOptions": {
//     "target": "ES2020",
//     "useDefineForClassFields": true,
//     "lib": ["ES2020", "DOM", "DOM.Iterable"],
//     "module": "ESNext",
//     "skipLibCheck": true,

//     /* Bundler mode */
//     "moduleResolution": "bundler",
//     "allowImportingTsExtensions": true,
//     "isolatedModules": true,
//     "moduleDetection": "force",
//     "noEmit": true,
//     "jsx": "react-jsx",

//     /* Linting */
//     "strict": true,
//     "noUnusedLocals": true,
//     "noUnusedParameters": true,
//     "noFallthroughCasesInSwitch": true
//   },
//   "include": ["src"]
// }
// `,
//         isBinary: false
//     },
//     [`${WORK_DIR}/tsconfig.node.json`]: {
//         type: 'file',
//         content: `{
//   "compilerOptions": {
//     "target": "ES2022",
//     "lib": ["ES2023"],
//     "module": "ESNext",
//     "skipLibCheck": true,

//     /* Bundler mode */
//     "moduleResolution": "bundler",
//     "allowImportingTsExtensions": true,
//     "isolatedModules": true,
//     "moduleDetection": "force",
//     "noEmit": true,

//     /* Linting */
//     "strict": true,
//     "noUnusedLocals": true,
//     "noUnusedParameters": true,
//     "noFallthroughCasesInSwitch": true
//   },
//   "include": ["vite.config.ts"]
// }
// `,
//         isBinary: false
//     },
// }