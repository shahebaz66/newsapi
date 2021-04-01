var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../db');
const bcrypt = require('bcrypt');
/* GET users listing. */
router.put('/login', async function (req, res, next) {
    var user = await db.query(`SELECT * FROM users WHERE email=?`, [req.body.email]);

    var pass
    
    bcrypt.compare(req.body.password,user[0].password, function (err, result) {
        
    if (result) {
        var email = user[0].email
        var token = jwt.sign({ email }, 'mytokensecrectveryhardtobreack');
        res.status(200).json({ loggedIn: true, jwt: token })
    } else {
        res.status(200).json({ message: "email or password incorrect" })
    }
});
});
router.post('/signup', async function (req, res, next) {
    var pass
    if (req.body.email != "" && req.body.password != "") {
    var a=await db.query(`SELECT * FROM users WHERE email=?`,[req.body.email])
    if(a.length ==0){
        
            bcrypt.hash(req.body.password, 10, async function (err, hash) {
    
    
                var user = await db.query(`INSERT INTO users (email,password) VALUES (?,?)`, [req.body.email, hash]);
               if(user){
                var email = req.body.email
                var token = jwt.sign({ email }, 'mytokensecrectveryhardtobreack');
                res.status(200).json({ loggedIn: true, jwt: token })
               }
            });
        
    }else{
        res.status(409).json({ message:"email already exist" })
    }
} else {
    res.send('enter all fields');
}
        

    
});

module.exports = router;