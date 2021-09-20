const { UsersDate } = require('../models/userModel')

async function findAuthUser(email) {
    return await UsersDate.findOne({ email: email });
}
module.exports = { findAuthUser }