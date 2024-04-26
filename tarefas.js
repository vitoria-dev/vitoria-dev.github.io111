document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');

    const routes = {
        '/': home,
        '/add': addTarefa,
    }

    window.navigateTo = function (route) {
        if (route === "/index.html") {
            route = "/";
        }
        if (routes[route]) {
            window.history.pushState({}, route, window.location.origin + route);
            routes[route]();
        }
    };

    function home() {
        app.innerHTML = `
            <h1>Lista de Tarefas</h1>
            <button onclick="navigateTo('/add')">Adicionar Tarefa</button>
            <ul id="task-list"></ul>
        `;

        renderTarefaLista();
    }

    function renderTarefaLista() {
        const taskList = document.getElementById('task-list');
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach((taskText, index) => {
            const newTaskItem = document.createElement('li');
            newTaskItem.textContent = taskText;

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', function () {
                const newText = prompt('Editar Tarefa:', taskText);
                if (newText !== null) {
                    tasks[index] = newText;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTarefaLista();
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', function () {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTarefaLista();
            });

            newTaskItem.appendChild(editButton);
            newTaskItem.appendChild(deleteButton);
            taskList.appendChild(newTaskItem);
        });
    }


    function addTarefa() {
        app.innerHTML = `
            <h1>Adicionar Tarefa</h1>
            <form id="task-form">
                <input type="text" id="task-input" placeholder="Adicionar nova tarefa">
                <button type="submit" id="adicionar">Adicionar</button>
            </form>
        `;
        const taskForm = document.getElementById('task-form');

        taskForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const taskInput = document.getElementById('task-input');
            const taskText = taskInput.value.trim();
            if (taskText !== '') {
                const newTaskItem = document.createElement('li');
                newTaskItem.textContent = taskText;
                let taskList = document.getElementById('task-list');
                if (!taskList) {
                    taskList = document.createElement('ul');
                    taskList.id = 'task-list';
                    app.appendChild(taskList);
                }
                taskList.appendChild(newTaskItem);
                taskInput.value = '';

                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks.push(taskText);
                localStorage.setItem('tasks', JSON.stringify(tasks));

                renderTarefaLista();
            }
        });
    }

    function carregarTarefas() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(taskText => {
            const newTaskItem = document.createElement('li');
            newTaskItem.textContent = taskText;
            taskList.appendChild(newTaskItem);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        carregarTarefas();
    });

    window.onpopstate = () => {
        const path = window.location.pathname;
        navigateTo(path);
    };

    navigateTo(window.location.pathname);

});