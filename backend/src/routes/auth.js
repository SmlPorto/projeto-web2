const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const checkToken = require("../middlewares/checkToken")

router.get('/', checkToken.checkTokenBearer, async function (req, res, next) {
    try {
        const user = await userController.getUserById(req.id);
        res.status(200).json({
            user
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            msg: "Invalid token"
        })
    }

});

router.post('/', async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await userController.userAuth(email, password);
        console.log(user);
        const secret = process.env.SECRET;
        const token = jwt.sign({
            id: user.id
        }, secret, {
            expiresIn: '1 hr'
        });
        res.status(200).json({
            msg: "user authenticated successfully",
            token: token
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            msg: "User not authenticated"
        })
    }
});

module.exports = router;