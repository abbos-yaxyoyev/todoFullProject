const { Router } = require('express')

const {
    getAllTodos,
    getTodoById,
    postTodo,
    deleteTodo,
    patchCompleted,
    putTitle
} = require('../controllers/TodoListControllers')

const router = Router()

router.get('/', getAllTodos)
router.get('/:id', getTodoById)
router.post('/', postTodo)
router.patch('/:id', patchCompleted)
router.put('/:id', putTitle)
router.delete('/:id', deleteTodo)

module.exports = {
    todoListRouter: router
}