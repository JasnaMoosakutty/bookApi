var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const {
    db
} = require('./globals'); // your common module

var neglectedRoutes = ['login'];

router.use((req, res, next) => {
  
    if (neglectedRoutes.some(route => req.originalUrl.includes(route))) {
        next();
    } else {
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
    }
});






router.post('/login', function(req, res) {


    var username = req.body.username;
    var password = req.body.password;
    console.log(username)
    if (username && username != '' && password && password != '') {
        
        db.any("SELECT password from user_details2 where username=$1", [username])
            .then(function(data) {
                
                console.log(data[0].password)
                console.log(bcrypt.compareSync(password, data[0].password))
                if (data.length > 0 && bcrypt.compareSync(password, data[0].password)) {
                    var role = data[0].role_id;
                    var user_id = data[0].id;
             
                        const payload = {
                            check: true
                        };
                        var token = jwt.sign(payload, process.env.SECRET, {
                            expiresIn: "1 days"
                        });
                        res.status(200)
                            .json({
                                status: 100,
                                token: token,
                                success: true,
                                message: 'Logged in Successfully'
                            });
                
                } else {
                    res.status(200)
                        .json({
                            status: 102,
                            success: false,
                            message: 'Invalid Credentials'
                        });
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(200)
                    .json({
                        status: 102,
                        success: false,
                        message: 'Invalid Credentials'
                    });
            });
    } else {
        res.json({
            status: 102,
            success: false,
            message: ' Please enter mandatory fields'
        });
    }
});

module.exports = router;