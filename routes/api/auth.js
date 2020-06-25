const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')


// @route  GET api/auth
// @desc   Get User
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error.' })
    }
})

// @route  POST api/auth
// @desc   Authenticat User and Get User
// @access Public
router.post('/', [
    check('email', 'Please enter a valid email address.').isEmail(),
    check('password', 'Please enter the password.').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status('400').json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
        // check user exists
        let user = await User.findOne({ email })
        if (!user) {
            return res.status('400').json({ errors: [{ msg: 'Invalid Credentials.' }] })
        }
        // check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status('400').json({ errors: [{ msg: 'Invalid Credentials.' }] })
        }
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