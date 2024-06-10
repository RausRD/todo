// Знаходимо елементи на сторінці
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach(task => renderTask(task))
}

checkEmptyList()

// Додавання завдання
form.addEventListener('submit', addTask)

// Видалення завдання
tasksList.addEventListener('click', deleteTask)

// Відмічаю задачу закінченою
tasksList.addEventListener('click', doneTask)

function addTask(e) {
	e.preventDefault()

	// Достаю текст задачі з поля вводу
	const taskText = taskInput.value

	// Описую задачу у вигляді об'єкту
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	// Додаю задачу в масив з задачами
	tasks.push(newTask)
	saveToLocalStorage()

	renderTask(newTask)

	// Очистка поля вводу
	taskInput.value = ''
	taskInput.focus()

	checkEmptyList()
}

function deleteTask(e) {
	// Якщо я клікнув не по кнопці 'видалити задачу'
	if (e.target.dataset.action !== 'delete') {
		return
	}

	// Перевіряю клік по кнопці "видалити задачу"
	const parentNode = e.target.closest('.list-group-item')

	// Оприділяю id задачі
	const id = Number(parentNode.id)

	// Знаходимо індекс задачі в масиві
	const index = tasks.findIndex(function (task) {
		return task.id === id
	})

	// Видаляю задачу з масива задач
	tasks.splice(index, 1)
	saveToLocalStorage()

	// Удаляю через фільтрацію
	// tasks = tasks.filter((tasks) => tasks.id !== id)

	parentNode.remove()
	checkEmptyList()
}

function doneTask(e) {
	// Якщо я клікнув не по кнопці 'видалити задачу'
	if (e.target.dataset.action !== 'done') return

	const parentNode = e.target.closest('.list-group-item')

	const id = Number(parentNode.id)
	const task = tasks.find(task => task.id === id)
	task.done = !task.done
	saveToLocalStorage()
	// Перевіряю що колікбув виконаний по кнопці "Задача виконана"
	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`
		tasksList.insertAdjacentHTML('afterbegin', emptyListElement)
	}
	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формую css клас
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

	// Формую розмітку для нового завдання
	const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`

	// Додати задачу на сторінку
	tasksList.insertAdjacentHTML('beforeend', taskHtml)
}
