const express = require('express')
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')
const router = express.Router()


// @route  POST api/users
// @desc   Register User
// @access Public
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please enter a valid email address.').isEmail(),
    check('password', 'Please enter a password with more than 6 characters.').isLength({ 'min': 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status('400').json({ errors: errors.array() })
    }
    const { name, email, password } = req.body

    try {
        // check user exists
        let user = await User.findOne({ email })
        if (user) {
            return res.status('400').json({ errors: [{ msg: 'User already exists.' }] })
        }
        // get user avatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        // create user
        user = new User({
            name,
            email,
            password,
            avatar
        })

        // Encrypt Password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        // save user
        await user.save()

        // return JsonWebToken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtToken'), { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            return res.json({ token })
        })

    } catch (error) {
        console.log(error.message);
        return res.status('500').send('Server Error')
    }


})

module.exports = router