import { useState, useRef, useEffect } from 'react';
import NewTodo from '../../Components/NewTodo/NewTodo';
import './Home.css';
import ColorSelector from '../../Components/ColorSelector/ColorSelector';


export default function Home(){

  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  const nextID = JSON.parse(localStorage.getItem('nextID'));
  const [boxes, setBoxes] = useState(savedTasks || []);
  const draggedItem = useRef(null);
  const draggedItemNode = useRef(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [createTask, setCreateTask] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSelector, setShowSelector] = useState({});
  const [nextBoxId, setNextBoxId] = useState(nextID || 1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setCreateTask((prevCreateTask) => !prevCreateTask);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(boxes));
    localStorage.setItem('nextID', JSON.stringify(nextBoxId))
  }, [boxes, nextBoxId]);

  //  Move this to hook or something
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  const today = formatDate(new Date());

  //  DRAG LOGIC

  const handleDragStart = (e, item) => {
      setIsDragging(true);
      draggedItemNode.current = e.target;
      draggedItemNode.current.addEventListener('dragend', handleDragEnd);
      draggedItem.current = item;
    
      // Calculate the offset
      const rect = draggedItemNode.current.getBoundingClientRect();
      setOffsetX(e.clientX - rect.left);
      setOffsetY(e.clientY - rect.top);
    
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
    };

  const handleDragEnd = (e) => {
    e.target.style.display = '';
    setIsDragging(false);

    const deleteButtonRect = document.querySelector('.add-button').getBoundingClientRect();
    if (
      e.clientX >= deleteButtonRect.left &&
      e.clientX <= deleteButtonRect.right &&
      e.clientY >= deleteButtonRect.top &&
      e.clientY <= deleteButtonRect.bottom
    ) {
      const updatedBoxes = boxes.filter(box => box.id !== draggedItem.current.id);
      setBoxes(updatedBoxes);
    }

    draggedItemNode.current.removeEventListener('dragend', handleDragEnd);
    draggedItem.current = null;
    draggedItemNode.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
  
    // Get the bounding rectangle of the arena-container
    const arenaRect = e.currentTarget.getBoundingClientRect();
  
    // Calculate the drop position, adjusting for the arena's position and the offset
    let x = e.clientX - arenaRect.left - offsetX;
    let y = e.clientY - arenaRect.top - offsetY;
  
    // Boundary checks
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + 100 > arenaRect.width) x = arenaRect.width - 100;  // 100 is the width of the box
    if (y + 100 > arenaRect.height) y = arenaRect.height - 100; // 100 is the height of the box
  
    const droppedBox = boxes.find(box => box.id === draggedItem.current.id);
    const updatedBoxes = boxes.map(box => {
      if (box.id === droppedBox.id) {
        return {
          ...box,
          x,
          y
        };
      }
      return box;
    });
    setBoxes(updatedBoxes);
  };
  
  // TASK LOGIC

  const handleCreateTask = (taskName, taskColor = '#252525') => {
    const newBox = {
      id: `box${nextBoxId}`,
      content: taskName,  // will be 'Default Task Name' if taskName is undefined
      color: taskColor,   // will be '#252525' if taskColor is undefined
      x: 250, // Centered position, adjust as needed
      y: 250, // Centered position, adjust as needed
    };
    setBoxes(prevBoxes => [...prevBoxes, newBox]);
    setNextBoxId(prevId => prevId + 1);
    setCreateTask(false); // Close the NewTodo component after adding the task
};

  // Task Click

  const handleClick = (id) => {
    setShowSelector((prevShowSelector) => {
      const updatedSelector = {
        ...prevShowSelector,
        [id] : !prevShowSelector[id]
      }
      console.log('Updated showSelector:', updatedSelector);
      return updatedSelector;
    })
  }

  return (
    <div className="main-container">
      <div className="sidebar">
        <h1 className="heading">todo</h1>
        <div className="buttons">
          <div className={`add-button ${isDragging ? 'is-dragging' : ''}`} onClick={() => setCreateTask((prevCreateTask) => !prevCreateTask)}>
            {isDragging ? "delete task" : (createTask ? "never mind" : "add new todo")}
          </div>
        </div>
      </div>
      <div className="arena-container" onDragOver={handleDragOver} onDrop={handleDrop}>
        <h1 className="date">{today}</h1>
        {boxes.map((box) => (
        <div
          key={box.id}
          className="draggable-box"
          draggable
          onDragStart={(e) => handleDragStart(e, box)}
          onClick={() => handleClick(box.id)}
          style={{
            backgroundColor: `${box.color}`,
            left: `${box.x}px`,
            top: `${box.y}px`
          }}
        >
          {showSelector[box.id] && <ColorSelector setBoxes={setBoxes} id={box.id}/>}
          <span>{box.content}</span> {/* Wrap the content in a span for better styling control */}
        </div>
      ))}
      </div>
      {createTask && <NewTodo onCreateTask={handleCreateTask} />}
    </div>
  );
}