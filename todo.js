// Variables
let todoItems = [];
const todoInput = document.querySelector('.todo-input');
const completedTodosDiv = document.querySelector('.completed-todos');
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos');
const audio = new Audio('click.wav');

// Get the todo list on the first boot
window.onload = () => {
  let storageTodoItems = localStorage.getItem('todoItems');
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }
  render();
};

// Get the content typed into the input
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, '');
  if (value && e.keyCode === 13) {
    addTodo(value);

    todoInput.value = '';
    todoInput.focus();
  }
};

// Add todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });
  saveAndRender();
}

// Remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

// Mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.map((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }
    return todo;
  });
  audio.play();
  saveAndRender();
}

// Mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.map((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }
    return todo;
  });
  saveAndRender();
}

// Save in local storage
function save() {
  localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// Render
function render() {
  completedTodosDiv.innerHTML = ''; // Clear the existing content
  uncompletedTodosDiv.innerHTML = ''; // Clear the existing content

  let uncompletedTodos = todoItems.filter((item) => !item.completed);
  let completedTodos = todoItems.filter((item) => item.completed);

  if (uncompletedTodos.length > 0) {
    uncompletedTodos.forEach((todo) => {
      uncompletedTodosDiv.appendChild(createTodoElement(todo));
    });
  } else {
    uncompletedTodosDiv.innerHTML = `<div class='empty'>No uncompleted mission</div>`;
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='complete-title'>Completed (${completedTodos.length})</div>`;
    completedTodos.forEach((todo) => {
      completedTodosDiv.appendChild(createTodoElement(todo));
    });
  }
}

// Save and render
function saveAndRender() {
  save();
  render();
}
let timer;
let seconds = 0;

function toggleTimer() {
    if (!timer) {
        timer = setInterval(updateTimer, 1000);
        document.getElementById('timerButton').textContent = 'Stop Timer';
        document.getElementById('restartButton').style.display = 'inline-block';
    } else {
        clearInterval(timer);
        timer = null;
        document.getElementById('timerButton').textContent = 'Start Timer';
    }
}

function restartTimer() {
    clearInterval(timer);
    seconds = 0;
    document.getElementById('timerDisplay').textContent = '00:00:00';
    document.getElementById('timerButton').textContent = 'Start Timer';
    document.getElementById('restartButton').style.display = 'none';
}

function updateTimer() {
    seconds++;
    const formattedTime = formatTime(seconds);
    document.getElementById('timerDisplay').textContent = formattedTime;
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


// Create todo list item
function createTodoElement(todo) {
  // Create todo list container
  const todoDiv = document.createElement('div');
  todoDiv.setAttribute('data-id', todo.id);
  todoDiv.className = 'todo-item';

  // Create todo item text
  const todoTextSpan = document.createElement('span');
  todoTextSpan.innerHTML = todo.text;

  // Checkbox for the list
  const todoInputCheckbox = document.createElement('input');
  todoInputCheckbox.type = 'checkbox';
  todoInputCheckbox.checked = todo.completed;
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest('.todo-item').dataset.id;
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
  };

  // Delete button
  const todoRemoveBtn = document.createElement('a');
  todoRemoveBtn.href = '#';
  todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M18 6l-12 12"></path>
    <path d="M6 6l12 12"></path>
 </svg>`;
  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest('.todo-item').dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv;
}
