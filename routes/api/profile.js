const express = require('express')
const request = require('request')
const config = require('config')
const normalize = require('normalize-url');
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const { check, validationResult } = require('express-validator')
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

// @route  POST api/profile
// @desc   create or update a user profile
// @access Private
router.post('/', [auth,
    [
        check('status', 'Status is required..').not().isEmpty(),
        check('skills', 'Skills is required..').not().isEmpty()
    ]], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status('400').json({ errors: errors.array() })
        }
        const {
            company,
            location,
            website,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook
        } = req.body;
        // build profile
        const profileFields = {
            user: req.user.id,
            company,
            location,
            website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
            bio,
            skills: Array.isArray(skills)
                ? skills
                : skills.split(',').map((skill) => skill.trim()),
            status,
            githubusername
        };
        // Build social object and add to profileFields
        const socialfields = { youtube, twitter, instagram, linkedin, facebook };
        for (const [key, value] of Object.entries(socialfields)) {
            if (value && value.length > 0)
                socialfields[key] = normalize(value, { forceHttps: true });
        }
        profileFields.social = socialfields;
        // save to db
        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (!profile) {//create
                profile = new Profile(profileFields)
                profile.save()
            } else {//update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }// return new document
                )
            }
            return res.json(profile)
        } catch (error) {
            console.log(error.message);
            return res.status(500).send('Server Error.')
        }
    })

// @route  GET api/profile
// @desc   get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        if (!profiles) {
            return res.status(400).json({ msg: 'No profile.' })
        }
        return res.json(profiles)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  GET api/profile/user/:user_id
// @desc   get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'No profile.' })
        }
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'No profile.' })
        }
        return res.status(500).send('Server Error.')
    }
})

// @route  DELETE api/profile
// @desc   get profile ,user and posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        // delete user
        await Post.deleteMany({ user: req.user.id })
        // delete profile
        await Profile.findOneAndRemove({ user: req.user.id })
        // delete user
        await User.findOneAndRemove({ _id: req.user.id })
        return res.json({ msg: 'User removed.' })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  PUT api/profile/experience
// @desc   add profile experience
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required').notEmpty(),
]], async (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
        return res.status(400).json({ errs: errs.array() })
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        profile.experience.unshift(newExp)
        await profile.save()
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  DELETE api/profile/experience/:exp_id
// @desc   delete experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        profile.experience = profile.experience.filter(exp => exp.id != req.params.exp_id)
        await profile.save()
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  PUT api/profile/experience/:exp_id
// @desc   update experience
// @access Private
router.put('/experience/:exp_id', auth, async (req, res) => {
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        let targetExp = profile.experience.filter(exp => exp.id == req.params.exp_id)[0]
        Object.assign(targetExp, { ...newExp, _id: targetExp.id })
        await profile.save()
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})


// @route  PUT api/profile/education
// @desc   add profile education
// @access Private
router.put('/education', [auth, [
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field-of-study is required').notEmpty(),
    check('from', 'From date is required').notEmpty(),
]], async (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
        return res.status(400).json({ errs: errs.array() })
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        profile.education.unshift(newEdu)
        await profile.save()
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  DELETE api/profile/education/:edu_id
// @desc   delete education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        profile.education = profile.education.filter(edu => edu.id != req.params.edu_id)
        await profile.save()
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  PUT api/profile/education/:exp_id
// @desc   update education
// @access Private
router.put('/education/:edu_id', auth, async (req, res) => {
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body
    const newExp = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        let targetEdu = profile.education.filter(exp => exp.id == req.params.edu_id)[0]
        Object.assign(targetEdu, { ...newExp, _id: targetEdu.id })
        await profile.save()
        return res.json(profile)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

// @route  GET api/profile/github/:username
// @desc   get github repos
// @access Public
router.get('/github/:username', async (req, res) => {
    const options = {
        uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created_at:asc&client_id=${config.get('githubId')}&client_secret=${config.get('githubSecret')}`,
        method: 'GET',
        headers: { 'User-Agent': 'node.js' },
    }
    console.log(options);
    try {
        request(options, (err, response, body) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: err })
            }
            if (response.statusCode != 200) {
                console.log(response.statusCode);
                return res.status(404).send({ msg: 'Github repo not found' })
            }
            return res.json(JSON.parse(body))
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error.')
    }
})

module.exports = router