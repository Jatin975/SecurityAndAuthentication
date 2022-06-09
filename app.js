require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));


const userSchema = new mongoose.Schema( {
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
    

});

app.post("/login", function(req, res){

    const password = req.body.password;

    User.findOne({email: req.body.username}, 
        function(err, userFound){
            if(!err){
                if(userFound){
                    bcrypt.compare(password, userFound.password, function(err,result) {
                        // result == true
                            if(result === true){
                                res.render("secrets");
                            }
                    });

                }else{
                    console.log("Login detail does not exists pls register!");
                }
            }else{
                console.log(err);
            }
        })
})
app.listen(3000, function(){
    console.log("Server started on port 3000");
});

    