import { useState, useEffect } from "react";
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { invoke } from "@tauri-apps/api/tauri";
import UpdateChecker from './components/UpdateChecker';
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }


  // Todos
  const [todos, setTodos] = useState([]); // Initialize as an empty array

  const fetchTodos = async () => {
    const todos = await invoke('get_todos');
    setTodos(todos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    const newTodo = {
      id: (new Date()).toISOString(), // Temporary ID until we get the real one from the backend
      text,
      completed: false,
    };

    // Optimistically update the state
    setTodos([...todos, newTodo]);

    // Invoke backend to add the new todo
    await invoke('add_todo', { text });

    // Fetch the latest todos from the backend to ensure consistency
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    // Optimistically update the state
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));

    // Invoke backend to toggle the todo completion status
    await invoke('toggle_todo_completion', { id });

    // Fetch the latest todos from the backend to ensure consistency
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    // Optimistically update the state
    setTodos(todos.filter(todo => todo.id !== id));

    // Invoke backend to delete the todo
    await invoke('delete_todo', { id });

    // Fetch the latest todos from the backend to ensure consistency
    fetchTodos();
  };
  // Todos
  return (
    <div className="container">
      <h1>Welcome to your Watch List!</h1>

      <p>V1.0.6</p>

      <h1>Todo List</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
        <UpdateChecker />
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
