const db = require("../models");
const Tokens = db.tokens;

exports.genToken = async () => {
    const rand = function () {
        return Math.random().toString(36).substr(2);
    };
    const tok = rand() + rand();
    return tok;
}

/*
** Create a random token for user when login
*/
exports.createToken = async (user) => {
    const token = {
        userId: user.id,
        accessToken: await this.genToken(),
        refreshToken: await this.genToken(),
        expiresAt: Date.now() + 10000
    }
    const id = await Tokens.create(token).then(async (objTokens) => {
        return objTokens.id;
    }).catch(err => {
        console.error(err);
        return -1;
    });
    return id;
}