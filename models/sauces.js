const mongoose = require('mongoose')

const saucesSchema = mongoose.Schema({
    userId: { type: String, require: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, required: false},
    dislikes: { type: Number, required: false},
    usersLiked: { type: [String], required: false},
    usersDisliked: { type: [String], required: false},
}, { versionKey: false })

module.exports = mongoose.model('Sauces', saucesSchema)