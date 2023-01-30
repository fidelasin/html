const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret_key = process.env.secret_key;
console.log(secret_key)
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret_key);
        console.log("decodedToken")
        console.log(decodedToken)
        req.userData = decodedToken;
        next();
    }catch(error) {
        return res.status(401).send({
            message: 'Auth failed'
        });
    }
} 