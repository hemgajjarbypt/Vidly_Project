const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access Denied. no token provided.');
    }
    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        if (!req.user) {
            return res.status(403).send('Access Denied!, You are Not a Authenticated User');
        }
        next();
    } catch (error) {
        res.status(500).send(error);
    }
}