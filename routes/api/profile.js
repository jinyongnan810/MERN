const express = require('express')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const router = express.Router()

// @route  GET api/profile/me
// @desc   get profile by user id
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'No profile.' })
        }
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

module.exports = router