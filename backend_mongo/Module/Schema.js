const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "images"
        }
    ],
    files: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "files"
        }
    ]
});

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        }
    ],
    comments: [
        {
            text: String,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            created: { type: Date, default: Date.now }
        }
    ]
});

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        }
    ],
    comments: [
        {
            text: String,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            created: { type: Date, default: Date.now }
        }
    ]
});

exports.UserModel = mongoose.model("users", userSchema);

exports.ImageModel = mongoose.model("images", imageSchema);

exports.FileModel = mongoose.model("files", fileSchema);