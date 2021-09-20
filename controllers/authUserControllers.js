const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findAuthUser } = require('../models/authModel');
const { validateEmailPassword } = require('../utils/utils');
async function loginAuth(req, res) {
    const { email, password } = req.body
    const { error } = validateEmailPassword(req.body);
    if (error) {
        let errorMessage = error.details.map(x => x.message).join(', ');
        return res.status(404).send(JSON.stringify(errorMessage))
    }
    const user = await findAuthUser(email)
    if (!user) {
        res.status(400).send({ message: 'Login or Password is incorrect' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(400).send({ message: 'Login or Password is incorrect' })
    }
    const token = jwt.sign({ _id: user._id }, config.get('SECRET_KEY'), { expiresIn: '12d' })
    res.status(200).send(JSON.stringify(token));

}

module.exports = {
    loginAuth
}

// 1. Find User by username
// 2. if it exists, compare password with database
// 3. if comparison is successfull, access granted and generate jwt