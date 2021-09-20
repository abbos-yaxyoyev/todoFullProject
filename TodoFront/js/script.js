if (!localStorage.getItem('token')) {
    window.location.assign('./login.html')
}
window.addEventListener("DOMContentLoaded", function () {
    //!check token
    const url = 'http://localhost:3000'
    tokenCheck()
    async function tokenCheck() {
        try {
            await fetch(`${url}/api/checkedToken`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => {
                    if (res.status == 401)
                        return 401;
                    else
                        if (res.status == 500)
                            return 500;
                        else
                            if (res.status == 201)
                                return res.json()
                })
                .then(res => {
                    console.log('2');
                    console.log(res);
                    if (res === 401 || res === 500) {
                        window.location.assign('./login.html')
                    }
                })
                .catch(err => console.log(err.message));
        } catch (err) {
            console.log(err.message);
        }
    }

    //!***********************************************************************!/

    const todoInput = document.querySelector('#input'),
        todoAddButton = document.querySelector('.first-form'),
        todoFilterTodo = document.querySelectorAll('.h3'),
        todoAllList = document.querySelector(".all-todos"),
        todoDoing = document.querySelector('.todo-doing'),
        todoDone = document.querySelector(".todo-done"),
        todoBtn = document.querySelector('.btn');
    //*******************/
    const logaut = document.querySelector('.logout');

    //************************************************************************* */
    // const url = 'http://localhost:3000/api/todoList';

    todoAddButton.addEventListener('submit', addTodolist);
    todoAllList.addEventListener('click', deleteTodo);
    todoDoing.addEventListener('click', deleteTodo);
    todoDone.addEventListener('click', deleteTodo);
    todoBtn.addEventListener('click', filterTodo);
    window.addEventListener('load', upDateAllTodo, true);

    //! logaut website
    logaut.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.assign('./login.html')
    });



    //************************************************************************* */
    //! filter Post or Put request
    function addTodolist(e) {
        e.preventDefault();
        if (todoAddButton.id) {
            editTodo(e)
        } else {
            todoAdd(e)
        }
    }

    //************************************************************************* */
    //! creat todo list
    async function todoAdd(e) {
        e.preventDefault();
        let liTag = document.createElement('li');
        await fetch(`${url}/api/todoList`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: todoInput.value
            })
        })
            .then(res => res.json())
            .then(res => {
                let date = date_to_string(res)
                liTag.innerHTML = ` <p>${todoInput.value}</p>
                                    <section>
                                        <p>${date}</p>
                                        <span>
                                            <button class="complate "><i class="fas 2x fa-check"></i></button>
                                            <button class="edit "><i class="fas  fa-edit"></i></button>
                                            <button class="trash "><i class="fas  fa-trash"></i></button>
                                        </span>
                                    </section>
                                    `
                liTag.id = `${res._id}`;
            })
            .catch(err => alert(err.message));
        todoAllList.appendChild(liTag);
        todoInput.value = '';
    }

    //************************************************************************* */
    //! delete todo list
    async function deleteTodo(e) {
        const item = e.target;
        const todo = item.parentElement.parentElement.parentElement;
        const id = todo.id;
        if (item.classList[0] === "trash") {
            //* delete from mongoDB
            await fetch(`${url}/api/todoList/` + todo.id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(res => {
                    //* upDate page
                    todo.classList.add("fall");

                    //*at the end
                    todo.addEventListener("transitionend", () => {
                        todo.remove();
                    });
                })
                .catch(err => alert(err))

        } else if (item.classList[0] === "complate") {
            await complateTodo(todo, id)
        } else if (item.classList[0] === "edit") {
            todoInput.value = todo.firstElementChild.textContent;
            todoAddButton.id = id;
        }

    }

    //************************************************************************* */
    //! todo list done complated status
    async function complateTodo(todo, id) {
        //* add complate class
        await fetch(`${url}/api/todoList/` + id, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(res => {
                todo.classList.toggle("completed");
            })
            .catch(err => console.log(err.message))

        if (todo.parentElement.classList.contains("todo-done") && !todo.classList.contains("completed")) {
            todo.classList.add("fall");
            todo.addEventListener("transitionend", () => {
                todo.remove();
            });
        } else if (todo.parentElement.classList.contains("todo-doing") && todo.classList.contains("completed")) {
            todo.classList.add("fall");
            todo.addEventListener("transitionend", () => {
                todo.remove();
            });
        }
    }

    //************************************************************************* */
    //! edit todo list
    async function editTodo(e) {
        e.preventDefault();
        const id = todoAddButton.id;
        await fetch(`${url}/api/todoList/` + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: todoInput.value,
            })
        })
            .then(res => res.json())
            .then(res => {
                let date = date_to_string(res)
                if (todoFilterTodo[0].classList.contains('h3Btn')) {
                    todoAllList.childNodes.forEach((element, index, arrayNode) => {
                        if (element.id === id) {
                            element.firstElementChild.textContent = todoInput.value;
                            element.lastElementChild.firstElementChild.textContent = date;
                        }
                    })
                } else if (todoFilterTodo[1].classList.contains('h3Btn')) {
                    todoDoing.childNodes.forEach((element, index, arrayNode) => {
                        if (element.id === id) {
                            element.firstElementChild.textContent = todoInput.value;
                            element.lastElementChild.firstElementChild.textContent = date;
                        }
                    })
                } else if (todoFilterTodo[2].classList.contains('h3Btn')) {
                    todoDone.childNodes.forEach((element, index, arrayNode) => {
                        if (element.id === id) {
                            element.firstElementChild.textContent = todoInput.value;
                            element.lastElementChild.firstElementChild.textContent = date;
                        }
                    })
                }
            })
            .catch(err => console.log(err.message))

        todoAddButton.removeAttribute('id');
        todoInput.value = '';
    }

    //************************************************************************* */
    //! filter todo list All todo, Doing todo, Done todo list
    async function filterTodo(e) {

        if (e.target.id === 'all-todo') {
            todoAllList.innerHTML = null;
            todoDoing.style.display = 'none';
            todoDone.style.display = 'none';
            todoAllList.style.display = 'flex'
            e.target.classList.add('h3Btn')
            todoFilterTodo[1].classList.remove('h3Btn')
            todoFilterTodo[2].classList.remove('h3Btn')
            upDateAllTodo();
        } else
            if (e.target.id === 'todo-doing') {
                todoDoing.innerHTML = null;
                todoAllList.style.display = 'none';
                todoDone.style.display = 'none';
                todoDoing.style.display = 'flex';
                e.target.classList.add('h3Btn');
                todoFilterTodo[0].classList.remove('h3Btn');
                todoFilterTodo[2].classList.remove('h3Btn');
                upDateDoing()
            } else
                if (e.target.id === 'todo-done') {
                    todoDone.innerHTML = null;
                    todoAllList.style.display = 'none';
                    todoDoing.style.display = 'none'
                    todoDone.style.display = 'flex';
                    e.target.classList.add('h3Btn');
                    todoFilterTodo[0].classList.remove('h3Btn');
                    todoFilterTodo[1].classList.remove('h3Btn');
                    upDateDone()
                }
    }

    //************************************************************************* */

    async function upDateAllTodo() {
        await fetch(`${url}/api/todoList`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                data.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.date);
                    if (element.completed === true) {
                        todoAllList.innerHTML += `<li id="${element._id}" class="completed">
                                                    <p>${element.title}</p>
                                                    <section>
                                                        <p>${date}</p>
                                                        <span>
                                                            <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                            <button class="edit "><i class="fas  fa-edit"></i></button>
                                                            <button class="trash "><i class="fas  fa-trash"></i></button>
                                                        </span>
                                                    </section>
                                                </li>
                                                `
                    } else {
                        todoAllList.innerHTML += `<li id="${element._id}">
                                                <p>${element.title}</p>
                                                <section>
                                                    <p>${date}</p>
                                                    <span>
                                                        <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                        <button class="edit "><i class="fas  fa-edit"></i></button>
                                                        <button class="trash "><i class="fas  fa-trash"></i></button>
                                                    </span>
                                                </section>
                                            </li>
                                            `
                    }
                })
            })
            .catch(err => console.log(err))
    }

    //************************************************************************* */

    async function upDateDoing() {
        await fetch(`${url}/api/todoList/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                data.forEach(function (element, index, arrayNode) {
                    if (element.completed === false) {
                        let date = date_to_string(element.date);
                        todoDoing.innerHTML += `<li id="${element._id}">
                                                <p>${element.title}</p>
                                                <section>
                                                    <p>${date}</p>
                                                    <span>
                                                        <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                        <button class="edit "><i class="fas  fa-edit"></i></button>
                                                        <button class="trash "><i class="fas  fa-trash"></i></button>
                                                    </span>
                                                </section>
                                            </li>
                                            `
                    }
                })
            })
            .catch(err => console.log(err))
    }

    //************************************************************************* */

    async function upDateDone() {
        await fetch(`${url}/api/todoList`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                data.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.date)
                    if (element.completed == true) {
                        todoDone.innerHTML += `<li id="${element._id}" class="completed">
                                                <p>${element.title}</p>
                                                <section>
                                                    <p>${date}</p>
                                                    <span>
                                                        <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                        <button class="edit"><i class="fas  fa-edit"></i></button>
                                                        <button class="trash"><i class="fas  fa-trash"></i></button>
                                                    </span>
                                                </section>
                                            </li>
                                            `
                    }
                })
            })
            .catch(err => console.log(err))
    }

    //************************************************************************* */

    function date_to_string(jsonDate) {
        let backToDate = new Date(jsonDate);
        let arr = backToDate.toString().split(' ');
        return `${arr[1]}/${arr[2]}/${arr[3]}        Week days:${arr[0]}         ${arr[4]}`;
    }

});
