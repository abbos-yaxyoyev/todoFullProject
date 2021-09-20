const { Router } = require('express')

const { createUser } = require('../controllers/userNewSaveControllers')

const router = Router()

router.post('/', createUser)

module.exports = {
    newUserSaveRouter: router
}