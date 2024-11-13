export const TO_DO = `
"当然，我可以帮您创建一个简单的待办事项列表（Todo List）应用程序。我们将使用React和Tailwind CSS来构建这个应用。让我们开始吧！

<dalaranPage id="react-todo-list" title="React Todo List">

<dalaranAction type="file" filePath="src/components/TodoList.tsx">
import React, { useState } from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new todo"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
</dalaranAction>

<dalaranAction type="file" filePath="src/components/TodoItem.tsx">
import React from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="mr-2"
        />
        <span className={\`\${todo.completed ? 'line-through text-gray-500' : ''}\`}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 focus:outline-none"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
</dalaranAction>

<dalaranAction type="file" filePath="src/App.tsx">
import React from 'react';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <TodoList />
    </div>
  );
}

export default App;
</dalaranAction>

<dalaranAction type="shell">
npm run dev
</dalaranAction>

</dalaranPage>

现在，Todo List 应用程序已经创建完成。您可以在浏览器中查看结果。这个应用允许您添加新的待办事项、标记完成状态，以及删除待办事项。"
`


export default `"当然，我可以帮您创建一个简单的待办事项（Todo List）页面。我们将使用 HTML、CSS 和 JavaScript 来实现这个功能。我们将使用 Vite 作为开发服务器和构建工具。

<dalaranPage id="todo-list-app" title="Simple Todo List Application">


<dalaranAction type="shell">
npm install
</dalaranAction>


<dalaranAction type="shell">
npm run dev
</dalaranAction>
</dalaranPage>

这个简单的待办事项应用程序现在已经设置完成。它包括添加新任务和删除现有任务的功能，并使用本地存储来保存任务，以便在页面刷新后仍然保持。"`