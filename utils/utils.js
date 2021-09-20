const Joi = require('joi');
function validateTodoList(todoList) {
    const todoValidates = Joi.object({
        title: Joi.string().required().min(3),
    })
    return todoValidates.validate(todoList);
}

async function validateUcer(user) {
    const userValidated = Joi.object({
        name: Joi.string().required().min(3).max(30),
        lastName: Joi.string().required().min(3).max(30),
        email: Joi.string().required().min(7).max(100).email(),
        password: Joi.string().required().min(6).max(100),
    })
    return await userValidated.validate(user);
}

function validateEmailPassword(req) {
    const validatedAuth = Joi.object({
        email: Joi.string().required().min(7).max(100).email(),
        password: Joi.string().required().min(6).max(100),
    })
    return validatedAuth.validate(req);
}

function errorUserNotFound(res, user) {
    if (!user) {
        res.status(404).send(JSON.stringify({ message: "user not found" }))
    }
}


module.exports = {
    validateTodoList,
    validateUcer,
    validateEmailPassword,
    errorUserNotFound
}