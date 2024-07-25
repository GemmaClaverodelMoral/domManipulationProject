const body      = document.querySelector('body') // para el toogle del aspecto Dark o Light
const btnToggle = document.getElementById('toggle-theme-btn') // para cambiar el toogle del aspecto general
const taskForm  = document.getElementById('task-form'); //Para recojer los datos
const taskList  = document.getElementById('task-list'); //Como padre de las tareas
const taskInput = document.getElementById('task-input'); //para recojer el texto del form
const ul        = document.querySelector('ul') // para editar y borrar tareas


function toggleDarkLight() // cambio de Dark a Light del DOM y actualizacion en localStorage
{
    body.classList.toggle('dark-theme');
    setLocalStorageDarkLight()
}
function setLocalStorageDarkLight() // actualizacion de aspecto del DOM en localStorage
{
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light'
    localStorage.setItem("Theme", theme)
}
function setLocalStorageTask(task) // incorpora la tarea creada al local Storage
{
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

}
function getLocalStorage() // tomar los datos del local Storage de tema y lista de tareas
{
    getLocalStorageTheme()
    getLocalStorageTaskList()
}
function getLocalStorageTheme() // se toma del Local Storage el ultimo tema de la pagina Dark o Light
{
    const theme = localStorage.getItem("Theme")
    if (theme === 'dark') {
        body.classList.add('dark-theme')
    }
    localStorage.setItem("Theme", theme)
} 
function getLocalStorageTaskList() // se toma del Local Storage la ultima lista de tareas
{
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    tasks.forEach(task => taskList.appendChild(createTaskElement(task)))
} 
function createTask(event) // Abre un nuevo elemento de la lista de tareas con la estructura li + 2 spans
{
    event.preventDefault();
    const task = taskInput.value;

    if (task) {
        taskList.append(createTaskElement(task));
        taskInput.value = '';
        setLocalStorageTask(task)
    }
};
function createTaskElement(task) // Creacion de la estructura de <li> con 2 botones <span> icono (❌ o ✏️)
{ 
    const li = document.createElement('li');
    li.textContent = task;
    const newDiv = document.createElement('div');
    newDiv.append(
        createButton('❌', 'delete-btn'), 
        createButton('✏️', 'edit-btn'));
    li.append(newDiv)
    return li;
}
function createButton(text, className) // Creacion de boton <span>
{
    const btn = document.createElement('span');
    btn.textContent = text;
    btn.className = className;
    return btn;
}
function editDeleteTask(event) // Identificar evento ocurrido en <li>
{
    if (event.target.classList.contains('edit-btn')) {
        editTask(event)
    } else if (event.target.classList.contains('delete-btn')){
        deleteTask(event)
    }
    updateLocalStorageTaskList()
}
function deleteTask(event) // borrar tarea de la lista
{
    if (confirm("Are you sure to delete?: ")) {
        event.target.parentElement.parentElement.remove()
    }
}
function editTask(event) // Editar tarea 
{   
    const editItem = prompt('Modify this task:', event.target.parentElement.parentElement.firstChild.textContent)
    if (editItem !== null) {
        event.target.parentElement.parentElement.firstChild.textContent = editItem
    }
}
function updateLocalStorageTaskList() // Actualizar lista de tareas en LocalStorage
{
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li=> li.firstChild.textContent)
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
document.addEventListener('DOMContentLoaded', () => {
    getLocalStorage()
    btnToggle.addEventListener('click', toggleDarkLight)
    taskForm.addEventListener('submit', (event) => createTask(event))
    ul.addEventListener('click', (event) => editDeleteTask(event))
})