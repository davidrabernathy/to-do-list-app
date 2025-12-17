// get elements
var todoInput = document.getElementById('todoInput');
var categorySelect = document.getElementById('categorySelect');
var addButton = document.getElementById('addButton');
var todoList = document.getElementById('todoList');
var totalTasks = document.getElementById('totalTasks');
var completedTasks = document.getElementById('completedTasks');
var filterButtons = document.querySelectorAll('.filter-button');

// store todos with array
var todos = [];
var currentFilter = 'all';

// load todos from localStorage when page loads
function loadTodos()
{
  var storedTodos = localStorage.getItem('todos');
  if(storedTodos)
  {
    todos = JSON.parse(storedTodos);
    renderTodos();
  }
}

// save todos to localStorage
function saveTodos()
{
  localStorage.setItem('todos', JSON.stringify(todos));
}

// add new todo
function addTodo()
{
  var text = todoInput.value.trim();
  var category = categorySelect.value;

  // don't add empty todos
  if (text === '')
  {
    return;
  }

  // create todo object
  var todo = {id: Date.now(), text: text, completed: false, category: category};

  // add to array
  todos.push(todo);

  // clear input
  todoInput.value = '';

  // save and render
  saveTodos();
  renderTodos();
}

// delete todo
function deleteTodo(id)
{
  // filter out todo with this id
  todos = todos.filter(function(todo)
  {
    return todo.id !== id;
  });

  saveTodos();
  renderTodos();
}

// toggle todo completion
function toggleTodo(id)
{
  // find todo and flip its completed status
  todos = todos.map(function(todo)
  {
    if (todo.id == id)
    {
      todo.completed = !todo.completed;
    }
    return todo;
  });

  saveTodos();
  renderTodos();
}

// filter todos by category
function filterTodos()
  {
    if (currentFilter === 'all')
    {
      return todos;
    }

    return todos.filter(function(todo)
    {
      return todo.category === currentFilter;
    });
  }

// render all todos
function renderTodos()
{
  // clear todoList
  todoList.innerHTML = '';

  // get filtered todos based on current filter
  var filteredTodos = filterTodos();

  // if no todos, show empty state
  if (filteredTodos.length === 0)
  {
    todoList.innerHTML = '<div class = "empty-state"><p>no tasks here!</p><p style="font-size: 0.9em;">add one above to get started</p></div>';
    updateStats();
    return;
  }

  //create HTML for each todo
  filteredTodos.forEach(function(todo)
  {
    var li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('data-category', todo.category);
    if (todo.complete)
    {
      li.className += ' completed';
    }

    // checkbox
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', function()
    {
      toggleTodo(todo.id);
    });

    // text
    var textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    // category badge
    var badge = document.createElement('span');
    badge.className = 'category-badge ' + todo.category;
    badge.textContent = todo.category;

    // delete button
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'delete';
    deleteButton.addEventListener('click', function()
    {
      deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(badge);
    li.appendChild(deleteButton);

    todoList.appendChild(li);
  });

    updateStats();
}

// update status
function updateStats()
{
  var total = todos.length;
  var completed = todos.filter(function(todo)
  {
    return todo.compelted;
  }).length

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
}

// handle filter button clicks
filterButtons.forEach(function(button)
{
  button.addEventListener('click', function()
  {
  // remove active class from all buttons
  filterButtons.forEach(function(b)
  {
    b.classList.remove('active');
  });

  // add active class to clicked button
  button.classList.add('active');

  // set current filter
  currentFilter = button.getAttribute('data-filter');

  // re-render todos
  renderTodos();
  });
});

// event listeners
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', function(e)
{
  if (e.key === 'Enter')
  {
    e.preventDefault();
    addTodo();
  }
});

// load todos when page loads
loadTodos();





