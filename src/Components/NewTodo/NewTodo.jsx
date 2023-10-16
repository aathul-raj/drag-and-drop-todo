import { useState, useRef, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
export default function NewTodo({ onCreateTask }) {
  const [taskName, setTaskName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && taskName.trim()) {
      onCreateTask(taskName.trim());
      setTaskName('');
    }
  };

  return (
    <div className="create-container">
      <h1>Enter task:</h1>
      <input
        type="text"
        placeholder="Task name..."
        className="task-input"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        onKeyPress={handleKeyPress}
        ref={inputRef}
      />
    </div>
  );
}
