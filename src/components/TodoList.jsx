import React from 'react';

const TodoList = ({ todos, onToggle, onDelete }) => {
  if (!todos || todos.length === 0) {
    return <p>No todos available</p>;
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          {todo.text}
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;