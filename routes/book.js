var express = require('express');
var router = express.Router();
const {
    db,
    where,
    bigquery
} = require('./globals'); // your common module

var jwt = require('jsonwebtoken');
router.use((req, res, next) => {

    var token = req.headers['access-token'];
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    message: 'invalid token'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            message: 'No token provided.'
        });
    }
});




router.get('/list', function(req, res) {


      db.any("SELECT bookid,bookname,isbn,author FROM book d  ORDER BY bookname")
        .then(function(data) {
            console.log(data)
            res.status(200)
                .json({
                    status: 100,
                    success: true,
                    data: data,
                    message: 'Book details '
                });
        })
        .catch(function(err) {
            console.log('err', err);
            res.status(200)
                .json({
                    success: false,
                    message: 'Unable to get the Book details'
                });
        });
});



router.post('/add', function(req, res) {
    var bookName = req.body.bookName;
    var author = req.body.author;
    var isbn = req.body.isbn;
   
    if (bookName && bookName != '' && author && author != '' && isbn && isbn != '') {
        
                db.any("insert into book (bookname,author,isbn) values ($1, $2, $3)", [bookName, author, isbn])
                    .then(function() {

                    	

                        res.status(200)
                            .json({
                                status: 100,
                                success: true,
                                
                                message: 'Book Added successfully '
                            });
                    })
                    .catch(function(err) {
                        console.log('err=', err);
                        res.status(200)
                            .json({
                                success: false,
                                message: 'Unable to add Book details'
                            });
                    });
            
    } else {
        res.json({
            success: false,
            message: ' Please enter mandatory fields'
        });
    }
});

module.exports = router;
