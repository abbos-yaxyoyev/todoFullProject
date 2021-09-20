const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const config = require('config');

mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.debug("mongodbga ulanish muvaffaqiyatli amalga oshdi !!!");
    })
    .catch(err => {
        logger.log(err.message);
    });

const title = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now()
        },
        completed: {
            type: Boolean,
            default: false,
        },
        title: { type: String, trim: true, require: true },
    },
    { timestamps: true }
);

const titleSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        titles: {
            type: [title],
            default: []
        }
    }
);

const TitlesDate = mongoose.model("todoListEexpressJSes", titleSchema);

async function postCreatUcer_id(_id) {
    const userId = new TitlesDate({
        _id: _id,
    });

    return await userId.save();
}


async function getTodos(_id) {
    return await TitlesDate.findOne(
        { _id },
    )
}

async function postCreatTodo(id, title) {
    mongoose.set('useFindAndModify', false);
    let _id = mongoose.Types.ObjectId(id);
    return await TitlesDate.findOneAndUpdate(
        { _id: _id },
        {
            $push: {
                titles: {
                    date: Date.now(),
                    title: title
                }
            }
        }
    );
}

async function getId(user_id, titleId) {
    let _id = mongoose.Types.ObjectId(user_id);
    let id = mongoose.Types.ObjectId(titleId);
    return await TitlesDate.aggregate([
        { $match: { _id: _id } },
        { $unwind: "$titles" },
        { $match: { 'titles._id': id } }
    ]);
}

async function deletModulTodo(user_id, titleId) {
    let _id = mongoose.Types.ObjectId(user_id);
    let id = mongoose.Types.ObjectId(titleId);
    return await TitlesDate.updateOne(
        { _id: _id },
        { $pull: { titles: { _id: id } } },
        { multi: true }
    )
}

async function patchModulCompleted(this_id, titleId, title) {
    mongoose.set('useFindAndModify', false);
    let _id = mongoose.Types.ObjectId(this_id);
    let id = mongoose.Types.ObjectId(titleId);
    let boolean = title.completed
    if (boolean) {
        boolean = false;
    } else {
        boolean = true;
    }
    return await TitlesDate.updateOne(
        { _id: _id },
        { $set: { "titles.$[element].completed": boolean } },
        { arrayFilters: [{ "element._id": { $eq: id } }] }
        // { timestamps: false }
    );
}

async function putModulTitle(user_id, titleId, title) {
    mongoose.set('useFindAndModify', false);
    let _id = mongoose.Types.ObjectId(user_id);
    let id = mongoose.Types.ObjectId(titleId);
    return await TitlesDate.findOneAndUpdate(
        { _id: _id },
        {
            $set: {
                "titles.$[element].title": title,
                "titles.$[element].date": new Date()
            }
        },
        { arrayFilters: [{ "element._id": { $eq: id } }] }
    );
}

module.exports = {
    getTodos,
    postCreatTodo,
    getId,
    deletModulTodo,
    patchModulCompleted,
    putModulTitle,
    postCreatUcer_id
}