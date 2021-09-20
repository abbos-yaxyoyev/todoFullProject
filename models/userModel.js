const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const usersSchema = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 30,
            trim: true
        },
        lastName: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 30,
            trim: true
        },
        email: {
            required: true,
            type: String,
            trim: true,
            minlength: 7,
            maxlength: 50,
            unique: true
        },
        password: {
            required: true,
            type: String,
            minlength: 6,
            maxlength: 100,
        },
        date: {
            type: Date,
            default: new Date()
        },
    },
    { timestamps: false }
);
//! Custom validation for email
usersSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

const UsersDate = mongoose.model("usersDates", usersSchema);

async function getUcerId(email) {
    return await UsersDate.findOne({ email: email });
}

async function postCreatUcer(userObj) {
    const { name, lastName, email, password } = userObj;
    mongoose.set('useFindAndModify', false);
    const user = new UsersDate({
        name,
        lastName,
        email,
        password
    });

    return await user.save();
}

module.exports = { getUcerId, postCreatUcer, UsersDate }
