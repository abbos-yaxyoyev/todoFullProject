const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findAuthUser } = require('../models/authModel');
const { validateEmailPassword } = require('../utils/utils');
console.log('0');
async function loginAuth(req, res) {
    console.log('1');
    const secret = process.env.SECRET_KEY
    const { email, password } = req.body
    console.log('2');
    const { error } = validateEmailPassword(req.body);
    if (error) {
        let errorMessage = error.details.map(x => x.message).join(', ');
        return res.status(404).send(JSON.stringify(errorMessage))
    }
    console.log('3');
    const user = await findAuthUser(email)
    if (!user) {
        res.status(400).send({ message: 'Login or Password is incorrect' })
    }
    console.log('4');
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(400).send({ message: 'Login or Password is incorrect' })
    }
    console.log('5');
    const token = jwt.sign({ _id: user._id }, config.get('SECRET_KEY'), { expiresIn: '12d' })
    res.status(200).send(JSON.stringify(token));

}

module.exports = {
    loginAuth
}

// 1. Find User by username
// 2. if it exists, compare password with database
// 3. if comparison is successfull, access granted and generate jwt