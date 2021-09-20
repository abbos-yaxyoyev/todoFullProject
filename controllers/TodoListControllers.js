const { getTodos, postCreatTodo, getId, deletModulTodo, patchModulCompleted, putModulTitle } = require('../models/TodoListModules');
const { validateTodoList, errorUserNotFound } = require('../utils/utils');

//************************************************************************* */

async function getAllTodos(req, res) {
    const { _id } = req.user;
    const users = await getTodos(_id);
    errorUserNotFound(res, users);
    res.status(201).send(users.titles);
}

//************************************************************************* */

async function getTodoById(req, res) {
    const { id } = req.params;
    const { _id } = req.user;
    const user = await getId(_id, id);
    errorUserNotFound(res, user);
    res.status(201).send(user[0].titles);
}

//************************************************************************* */

async function postTodo(req, res) {
    const { error } = validateTodoList(req.body);
    if (error) {
        return res.status(404).send(error.details.map(x => x.message).join(', '))
    }
    const { title } = req.body;
    const { _id } = req.user;
    await postCreatTodo(_id, title);
    res.status(200).send(new Date());

}

//************************************************************************* */

async function deleteTodo(req, res) {
    const { id } = req.params;
    const { _id } = req.user;
    const user = await getId(_id, id);
    errorUserNotFound(res, user[0].titles);
    const userTodoList = await deletModulTodo(_id, id);
    res.status(201).send({
        message: "Product has been deleted",
        todo: {
            ...userTodoList
        }
    })
}

//************************************************************************* */

async function patchCompleted(req, res) {
    const { id } = req.params;
    const { _id } = req.user;
    const user = await getId(_id, id);
    errorUserNotFound(res, user[0].titles);
    const title = await patchModulCompleted(_id, id, user[0].titles);
    res.status(201).send(JSON.stringify(title));
}

//************************************************************************* */

async function putTitle(req, res) {
    const { title } = req.body;
    const { id } = req.params;
    const { _id } = req.user;

    const { error } = validateTodoList(req.body);
    if (error) {
        return res.status(404).send(error.details.map(x => x.message).join(', '))
    }

    const user = await getId(_id, id);
    errorUserNotFound(res, user[0].titles);
    await putModulTitle(_id, id, title);
    res.status(201).send(new Date());
}

//************************************************************************* */

module.exports = {
    getAllTodos,
    getTodoById,
    postTodo,
    deleteTodo,
    patchCompleted,
    putTitle
}
