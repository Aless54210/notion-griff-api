const db = require("../models");
const tokenController = require("./token.controller");
const Users = db.users;
const Tokens = db.tokens;
const bcrypt = require('bcrypt');

exports.hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);

        return (await bcrypt.hash(password, salt));
    } catch (err) {
        console.log(err);
    }
    return null;
}

exports.comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (err) {
        console.log(err);
    }
    return (false);
}

/* 
** Check user function
** Verify the cookie accessToken and verify that it exist on database
** Return the user with this token
*/
exports.checkUser = async (req, res) => {
    const head = req.get('Authorization')
    resData = {
        user: null,
        res: res
    }
    if (!head) {
        resData.res.status(401).json({
            message: "No 'Authorization' field in request header",
            success: false
        });
        return resData;
    }
    const apiKey = head.replace('Bearer', '').trim();
    let token = await Tokens.findOne({ where: { accessToken: apiKey } });
    if (!token) {
        resData.res.status(401).json({
            message: "Bad token!",
            success: false
        });
        return resData;
    }
    resData.user = await Users.findOne({ where: { tokensId: token.id } });
    return resData;
}
/*
** Register function
** params body: password, email, username
** response: success and/or message
*/
exports.register = async (req, res) => {
    if (!req.body.password || !req.body.email || !req.body.username) {
        res.status(400).json({
            message: "Content can not be empty!",
            success: false
        });
        return res;
    }

    const exist = await Users.findOne({ where: { email: req.body.email } });
    if (exist) {
        res.status(409).json({
            message: "Email already exist !",
            success: false
        });
        return res;
    }

    const user = {
        email: req.body.email,
        username: req.body.username,
        password: await exports.hashPassword(req.body.password),
        tokensId: -1,
    };
    await Users.create(user).then(async (objUser) => {
        objUser.tokensId = await tokenController.createToken(objUser);
        await objUser.save();
        res.status(200).json({
            success: true
        });
        return res;
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Some error occurred while creating the user.",
            success: false
        });
        return res;
    });
    return res;
};
/*
** Login function
** params body: email and password
** verify the hashed password in db with this password from body
** response: success and (message or data user)
*/
exports.login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            message: "Content can not be empty!",
            success: false
        });
        return res;
    }
    try {
        const user = await Users.findOne({ where: { email: req.body.email } })
        if (user) {
            const token = await Tokens.findOne({ where: { id: user.tokensId } })
            const correctPassword = await exports.comparePassword(req.body.password, user.password)
            if (correctPassword) {
                if (token.expiresAt < Date.now()) {
                    token.accessToken = await tokenController.genToken()
                    token.expiresAt = Date.now() + 10000
                    await token.save()
                }
                const userData = {
                    email: user.email,
                    username: user.username,
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                }
                res.status(200).json({
                    data: userData,
                    success: true
                });
            } else {
                res.status(401).json({
                    message: "Email or password is not correct !",
                    success: false
                });
            }
        } else {
            res.status(401).json({
                message: "Email or password is not correct !",
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(503).json({
            message: "Server error",
            success: false
        });
        return res;
    }
    return res;
};
/*
** Get User function
** Check user and return the user object
*/
exports.get = async (req, res) => {
    const { user, resData } = await this.checkUser(req, res);
    if (!user)
        return resData
    const userData = {
        email: user.email,
        username: user.username,
        favorites: user.favorites
    }
    res.status(200).json({
        data: userData,
        success: true
    });
    return res;
};
/*
** Logout function
** Just check user and clear cookie
*/
exports.logout = async (req, res) => {
    const { user, resData } = await this.checkUser(req, res);
    if (!user) {
        return resData
    }
    res.clearCookie("accessToken");
    res.status(200).json({
        success: true
    });
    return res;
};
/*
** Update user
** Check user and verify if favorites are changed
*/
exports.update = async (req, res) => {
    const { user, resData } = await this.checkUser(req, res);
    if (!user)
        return resData;
    if (user.favorites != req.body.favorites) user.favorites = req.body.favorites;
    try {
        await user.save();
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(503).json({
            message: "Server error",
            success: false
        });
        return res;
    }
    return res;
}
/*
** Get the user
** params url: userId
** response: username
*/
exports.getUserId = async (req, res) => {
    if (!req.params['userId']) {
        res.status(400).json({
            message: "Content can not be empty!",
            success: false
        });
        return res;
    }
    const user = await Users.findOne({ where: { id: req.params['userId'] } });
    if (!user) {
        res.status(401).json({
            message: "User doesn't exist !",
            success: false
        });
    } else {
        res.status(200).json({
            username: user.username,
            success: true
        });
    }
    return res;
};