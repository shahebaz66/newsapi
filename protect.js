var jwt = require('jsonwebtoken');
var db = require('./db')
var protect = async (req, res, next) => {
    let token;
    if (
        req.headers.Authorization &&
        req.headers.Authorization.startsWith('Bearer')
    ) {
        token = req.headers.Authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.signedCookies.jwt) {
        token = req.signedCookies.jwt;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    if (token) {
        //var email
        jwt.verify(token, 'mytokensecrectveryhardtobreack',async function (err, decoded) {
           var email = decoded.email
        if(email){
            var user = await db.query('SELECT * FROM users WHERE email=?', [email])
            if (user) {
                req.user = user[0]
                next()
            } else {
                res.status(401).json({ message: "unauthorised" })
            }
        }else{
            res.status(401).json({ message: "unauthorised" })
        }
    });
    } else {
        res.status(401).json({ message: "unauthorised" })
    }
}
//https://blog.logrocket.com/node-js-express-js-mysql-rest-api-example/
module.exports = protect