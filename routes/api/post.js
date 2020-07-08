const express = require('express')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const { check, validationResult } = require('express-validator')
const router = express.Router()

// @route  POST api/posts
// @desc   create a post
// @access Private
router.post('/', [auth, [
    check('text', 'Text is required').notEmpty()
]], async (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
        return res.status(400).json({ errors: errs.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        await newPost.save()
        return res.json(newPost)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server error.' })
    }

})

// @route  GET api/posts
// @desc   get all post
// @access Private
router.get('/', [auth], async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        return res.json(posts)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server error.' })
    }
})

// @route  GET api/posts/:id
// @desc   get a post by id
// @access Private
router.get('/:id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }
        return res.json(post)
    } catch (error) {
        console.log(error);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        return res.status(500).json({ msg: 'Server error.' })
    }
})

// @route  DELETE api/posts/:id
// @desc   delete a post by id
// @access Private
router.delete('/:id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' })
        }
        await post.remove()
        return res.json({ msg: 'Post removed.' })
    } catch (error) {
        console.log(error);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        return res.status(500).json({ msg: 'Server error.' })
    }
})

// @route  PUT api/posts/like/:id
// @desc   like a post
// @access Private
router.put('/like/:id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }
        const user_id = req.user.id
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' })
        }

        const filter = post.likes.filter(like => {
            if (like.user.toString() == user_id) {
                return true
            }
            return false
        })
        if (filter.length == 0) {
            post.likes.push({ user: user_id })
            await post.save()
        }

        return res.json(post.likes)
    } catch (error) {
        console.log(error);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        return res.status(500).json({ msg: 'Server error.' })
    }
})

// @route  PUT api/posts/unlike/:id
// @desc   remove like a post
// @access Private
router.put('/unlike/:id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }
        const user_id = req.user.id
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' })
        }

        post.likes = post.likes.filter(like => like.user.toString() != user_id)
        await post.save()
        return res.json(post.likes)
    } catch (error) {
        console.log(error);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        return res.status(500).json({ msg: 'Server error.' })
    }
})

// @route  POST api/posts/comment/:id
// @desc   comment a post
// @access Private
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').notEmpty()
]], async (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
        return res.status(400).json({ errors: errs.array() })
    }
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }
        const user_id = req.user.id
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' })
        }

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        post.comments.unshift(newComment)
        post.save()

        return res.json(post.comments)
    } catch (error) {
        console.log(error);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        return res.status(500).json({ msg: 'Server error.' })
    }
})

// @route  DELETE api/posts/comment/:id
// @desc   delete a comment
// @access Private
router.delete('/comment/:id/:comment_id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }
        const user_id = req.user.id
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' })
        }
        post.comments = post.comments.filter(comment => comment.id != req.params.comment_id && comment.user.toString() == user_id)
        post.save()

        return res.json(post.comments)
    } catch (error) {
        console.log(error);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found.' })
        }
        return res.status(500).json({ msg: 'Server error.' })
    }
})


module.exports = router