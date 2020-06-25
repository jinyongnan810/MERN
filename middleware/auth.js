const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    // get token from header
    const token = req.header('x-auth-token')
    // check token
    if (!token) {
        return res.status(401).json({ msg: 'No token.' })
    }
    // varify token
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'))
        req.user = decoded.user
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({ msg: 'Token not valid.' })
    }
}