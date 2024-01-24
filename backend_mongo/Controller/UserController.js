const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { UserModel } = require('../Module/Schema');
const e = require('express');
const secretKey = "This is a Secret";

exports.registerUser = async (req, res) => {
    try {
        const { email, password, username, mobile } = req.body;

        const userData = await UserModel.find({ email });

        if (userData.length > 0) { 
            res.status(400).json({
                data: {
                    message: "User already exists, Please login"
                }
            })
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newUser = await UserModel.create({ email, password: hash, username, mobile });

            res.status(200).json({
                message: `${username} register successfully`,
                data: {
                    newUser
                }
            })
        }
    } catch (err) {
        console.log("Somthing went wrong");
        console.log(err);
        res.status(404).json({
            status: "Somthing went wrong",
            message: err,
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await UserModel.find({ email }, { __v: 0, mobile: 0, files: 0, images: 0 });

        if (userData.length == 0) {
            return res.status(200).json({
                status: "false",
                message: "User not exist, Please register first"
            })
        }

        const isPasswordCorrect = bcrypt.compareSync(
            password,
            userData[0].password
        );

        if (!isPasswordCorrect) {
            return res.status(200).json({
                status: "false",
                message: "Wrong username or password",
            });
        }

        if (userData && isPasswordCorrect) {
            jwt.sign({ userData }, secretKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    res.status(400).json({
                        message: "Something went wrong, please try after sometime",
                    });
                } else {
                    const UserData = userData[0];

                    const { password, ...data } = UserData["_doc"];

                    res.status(200).json({
                        status: 'true',
                        auth: { token },
                        type: 'user',
                        message: `Welcome ${userData[0].username}`,
                        data,
                    });
                }
            })
        }

    } catch (err) {
        console.log("Somthing went wrong");
        res.status(404).json({
            status: "Somthing went wrong",
            message: err,
        });
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const allUsers = await UserModel.find({}, { _id: 0, __v: 0, password: 0, email: 0, mobile: 0, images: 0, files: 0 });

        if (allUsers.length == 0) {
            res.status(400).json({
                message: "No Users",
            });
        } else {
            res.status(200).json({
                allUsers
            });
        }
    } catch (err) {
        console.log("Somthing went wrong");
        res.status(404).json({
            status: "Somthing went wrong",
            message: err,
        });
    }
}

exports.userDetails = async (req, res) => {
    try {
        const allUsers = await UserModel.find({}, { _id: 0, __v: 0, password: 0, images: 0, files: 0 });

        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                console.log(err);
                res.status(201).json({
                    message: "Invalid Token",
                });
            } else {
                if (allUsers.length == 0) {
                    res.status(400).json({
                        message: "No Users",
                    });
                } else {
                    res.status(200).json({
                        allUsers,
                    });
                }
            }
        });

    } catch (err) {
        console.log("Somthing went wrong");
        res.status(404).json({
            status: "Somthing went wrong",
            message: err,
        });
    }
}

exports.getUserProfile = async (req, res) => {
    try { 
        const userId = req.params.userId;

        const userData = await UserModel.findOne({ _id: userId }, { _id: 0, __v: 0, password: 0, images: 0, files: 0 })
        // .populate([
        //     { path: "images", select: [ 'title', 'caption', 'creator', 'image', 'like' ] },
        //     { path: "files", select: [ 'title', 'description','creator', 'file', 'like' ] }
        // ]);

        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                console.log(err);
                res.status(201).json({
                    message: "Invalid Token",
                });
            } else {

                if (userData) {
                    res.status(200).json({
                        userData
                    });
                }
            }
        });
    } catch (err) {
        console.log("Somthing went wrong");
        res.status(404).json({
            status: "Somthing went wrong",
            message: err,
        });
    }
}

exports.updateDetails = async (req, res) => {
    try {
        const id = req.params.userId;
        const { newUserName, mobile } = req.body;

        const userData = await UserModel.findOneAndUpdate({ _id: id }, { username: newUserName, mobile: mobile }, { new: true });

        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                console.log(err);
                res.status(201).json({
                    message: "Invalid Token",
                });
            } else {
                if (userData) {
                    res.status(200).json({
                        message: "Details updated successfully",
                    });
                }
            }
        });

    } catch (err) {
        console.log("Somthing went wrong");
        res.status(404).json({
            status: "Somthing went wrong",
            message: err,
        });
    }
}