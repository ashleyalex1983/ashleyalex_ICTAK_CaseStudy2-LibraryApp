const express = require("express");
//for validation
const bodyparser = require("body-parser");
const { check, validationResult, matchedData } = require("express-validator")

//access Userdata
const Userdata = require('../models/Userdata');

//create seperate route handler for Login
const loginRouter = express.Router();

loginRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({ extended: true });
loginRouter.use(urlencodedParser);

function router(nav){

  //GET Login
  loginRouter.get('/',function(req,res){
    res.render('login',
    {
        nav,
        title:'LOGIN'
    });
  });

  //POST Login 
  loginRouter.post('/',urlencodedParser ,
    //rules
    [
      check('username')
        .trim()
        .isEmail().withMessage('Invalid - Enter your registered email'),
        // .normalizeEmail(),
      check('password','Password is required')
        .isLength({ min: 8 }).withMessage('Password must be of 8 characters')
    ],
    (req, res) => {

      // console.log(req.body);
      const errors = validationResult(req);

      var alerts = errors.mapped();
      // console.log(alerts);
      
      if(!errors.isEmpty())
      {
        //render login page with alerts
        res.render('login',
        {
          nav,
          title:'LOGIN',
          alerts
        })
      }
      else
      { //<!-- else of  if(!errors.isEmpty()) --Start-->

        var err;
        const username = req.body.username;
        const password = req.body.password;
        if(username === 'admin@libsys.com' && password === 'admin123?')
        {
          res.redirect('/admin');
        }
        else if(username === 'admin@libsys.com' && password != 'admin123?')
            {
              err ="Invalid Admin Password"; 
              res.render('login',
              {
                  nav,
                  title:'LOGIN',
                  'err' : err
              });
            }
            else{ //<!-- else --Start-->
                  Userdata.findOne({ user_email : username })
                  .then(function(user){  //console.log(user);
                    if(user === null)
                    { //User Not Found with Username
                        err = `Invalid User - SignUp for Login.` ;
                        res.render('login',
                        {
                            nav,
                            title:'LOGIN',
                            'err' : err
                        });
                    }
                    else{ // User Found with Username check if valid user with given password
                            // if(user.user_email === username && user.user_password === password)
                            if(user.user_password === password)
                            {
                              // Valid User 
                              // res.redirect('/loggedin');
                              const reader_name = user.user_fname + ' ' + user.user_lname;      
                              res.render('loggedin',
                              {
                                  nav:[
                                        {link:'/loggedin'        ,name:'Reader-Home'},
                                        {link:'/loggedin/books'  ,name:'Books'},
                                        {link:'/loggedin/authors',name:'Authors'}
                                      ],
                                  title: 'DASHBOARD -- READER',
                                  heading: 'Welcome ' + reader_name
                              });
                            }
                            else
                            { // User password does not match
                                err = "Invalid Username or Password";
                                res.render('login',
                                {
                                    nav,
                                    title:'LOGIN',
                                    'err' : err
                                });
                            }
  
                        }
                  }); //<!-- Userdata.findOne -->
                } //<!-- else --End-->

      } //<!-- else of  if(!errors.isEmpty()) --End-->


  });

  return loginRouter;
}


module.exports = router;