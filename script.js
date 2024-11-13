import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getDatabase, ref, set, get, child, update,push, remove, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA5uW7_-ZSqKvqWT_gTtZxrB4TecTBq2sg",
  authDomain: "friendlychat-136d7.firebaseapp.com",
  databaseURL: "https://friendlychat-136d7.firebaseio.com",
  projectId: "friendlychat-136d7",
  storageBucket: "friendlychat-136d7.appspot.com",
  messagingSenderId: "14153220093",
  appId: "1:14153220093:web:38aac7e08cabf80b306394"
};


// Initialize Firebase
var app = initializeApp(firebaseConfig);
var db = getDatabase(app);

document.getElementById('addTodoBtn').addEventListener('click', addTodo);
document.getElementById('deleteAllBtn').addEventListener('click', deleteAllTodos);

var todoInput = document.getElementById('todoInput');
todoInput.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

function loadTodos() {
    var dbRef = ref(db)

    get(child(dbRef,'todos')).then(snapshot => {
        const todos = snapshot.val();
        document.getElementById('todoList').innerHTML = ''; // Clear the existing list

        for (const id in todos) {
            addTodoToDOM(todos[id]);
        }
    })
}

// Call loadTodos when the page loads
window.onload = loadTodos;

function addTodo() {
   
    var todoText = todoInput.value;

    if (todoText === '') {
        alert('Please enter a todo');
        return;
    }

    // Push the new todo to Firebase
    const todoRef = ref(db, 'todos')
    push(todoRef);

    const todoData = {
        id: todoRef.key,  
        text: todoText
    };

    set(todoRef, todoData);
    addTodoToDOM(todoData);
    

    todoInput.value = ''; 
}

function addTodoToDOM(todoData){

    var li = document.createElement('li');
    li.setAttribute('data-id', todoData.id);
    var span = document.createElement('span');
    span.textContent = todoData.text;

    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editBtn';
    editBtn.addEventListener('click', () => editTodo(span, todoData.id));

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.addEventListener('click', () => deleteTodo(todoData.id, li));

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById('todoList').appendChild(li);

}

function editTodo(span) {
    var newText = prompt('Edit your todo:', span.textContent);
    if (newText !== null) {
        span.textContent = newText;

        var reff= ref(db,'todos/' + todoId)
        
        update(reff, {
            text: newText
        });
    }
}

function deleteTodo(li) {
    li.remove();
    var reff = ref(db,'todos/' + todoId)
    remove(reff);
}

function deleteAllTodos() {
    var todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
     // Clear all todos from Firebase
     var reff = ref(db,'todos')
     remove(reff);
}