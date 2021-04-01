var express = require('express');
var router = express.Router();
var db = require('../db')

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    var a = Date.now().toString() + file.originalname


    cb(null, a.toString()) //Appending .jpg
  }
})

var upload = multer({ storage: storage });
/* GET users listing. */



router.post('/createPost', upload.any(), async function (req, res, next) {
  //console.log(req.files);
  var photo = ""
  if(req.body.title && req.body.description){
  if (req.files.length > 0) {
    photo = `localhost:3100/images/${req.files[0].filename}`;
  }
  var post = await db.query(`INSERT INTO posts (title,description,image,userId) VALUES (?,?,?,?)`, [req.body.title, req.body.description, photo, req.user.id]);
  res.status(200).json(post)
}else{
  res.status(500).json("missing title or description")
}
});

router.patch('/updatePost', upload.any(), async function (req, res, next) {
  //console.log(req.files);
  var photo = ""
  if (req.files.length > 0) {
    photo = `localhost:3100/images/${req.files[0].filename}`;
  }
  var post = await db.query(`SELECT * FROM posts WHERE id=?`, [req.body.id]);
  if (post[0].userId == req.user.id) {
  var post = await db.query(`UPDATE posts SET title=?,description=?,image=? WHERE id=?`, [req.body.title, req.body.description, photo, req.body.id]);
  res.status(200).json(post)
  }else{
    res.status(401).json('unauthorised')
  }
});

router.delete('/deletePost/:id',  async function (req, res, next) {

  var post = await db.query(`SELECT * FROM posts WHERE id=?`, [req.params.id]);
  if (post[0].userId == req.user.id) {
    var post1 = await db.query(`DELETE FROM posts WHERE id=?`, [req.params.id]);
    res.status(200).json(post1)
  }else{
    res.status(401).json('unauthorised')
  }

});

router.get('/getPost/:id', async function (req, res, next) {

  var post = await db.query(`SELECT * FROM posts WHERE id=?`, [req.params.id]);
  res.status(200).json(post)

});

router.get('/getPost',  async function (req, res, next) {
  
  var post = await db.query(`SELECT * FROM posts`, []);
  res.status(200).json(post)

});

module.exports = router;
