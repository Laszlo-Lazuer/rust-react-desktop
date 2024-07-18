import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo"
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodo;