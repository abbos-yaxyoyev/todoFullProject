const { Router } = require('express')

const { loginAuth } = require('../controllers/authUserControllers')

const router = Router()

router.post('/login', loginAuth)

module.exports = {
    authRouter: router
}