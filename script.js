// DOM Elements
const loginPage = document.getElementById('login-page');
const app = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const tasksContainer = document.getElementById('tasks-container');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

// Load on start
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const username = localStorage.getItem('username') || 'User';
        showApp(username);
        loadTasks();
    } else {
        showLoginPage();
    }
});

function showLoginPage() {
    loginPage.classList.remove('hidden');
    app.classList.add('hidden');
}

function showApp(username) {
    loginPage.classList.add('hidden');
    app.classList.remove('hidden');
    userDisplay.textContent = `Halo, ${username}`;
    localStorage.setItem('username', username);
}

// Login (accept any non-empty username)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('isLoggedIn', 'true');
        showApp(username);
        loadTasks();
    } else {
        errorMessage.textContent = 'Username tidak boleh kosong!';
        setTimeout(() => errorMessage.textContent = '', 3000);
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    showLoginPage();
});

// Add task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const task = { id: Date.now(), text, completed: false };
        saveTask(task);
        renderTask(task);
        taskInput.value = '';
        updateTaskCount();
        showTasks();
    }
}

function renderTask(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    if (task.completed) span.classList.add('completed');

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '✕';

    checkbox.addEventListener('change', () => {
        span.classList.toggle('completed', checkbox.checked);
        updateTaskStatus(task.id, checkbox.checked);
        updateTaskCount();
    });

    delBtn.addEventListener('click', () => {
        li.remove();
        removeTask(task.id);
        updateTaskCount();
        if (getTasks().length === 0) hideTasks();
    });

    li.append(checkbox, span, delBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskStatus(id, completed) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function loadTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    tasks.forEach(renderTask);
    updateTaskCount();
    if (tasks.length > 0) showTasks();
}

function updateTaskCount() {
    const tasks = getTasks();
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${active} dari ${total} tugas`;
}

function showTasks() {
    tasksContainer.style.display = 'block';
    emptyState.style.display = 'none';
}

function hideTasks() {
    tasksContainer.style.display = 'none';
    emptyState.style.display = 'block';
}