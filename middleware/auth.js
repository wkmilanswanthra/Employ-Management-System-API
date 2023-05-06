const jwt = require('jsonwebtoken');

function authorize(role) {
    return function(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send('Unauthorized');
                }

                if (decoded.role === role) {
                    req.user = decoded;
                    next();
                } else {
                    res.status(403).send('Forbidden');
                }
            });
        } else {
            res.status(401).send('Unauthorized');
        }
    }
}

module.exports = authorize;