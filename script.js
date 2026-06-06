const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

addButton.addEventListener('click', addTodo);

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;

  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('todo-text');
  span.addEventListener('click', function () {
    li.classList.toggle('done');
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '×';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function () {
    todoList.removeChild(li);
  });

  li.appendChild(span);
  li.appendChild(deleteButton);
  todoList.appendChild(li);

  input.value = '';
  input.focus();
}
