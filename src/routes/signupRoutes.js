const express = require("express");
//for validation
const bodyparser = require("body-parser");
const { check, validationResult, matchedData } = require("express-validator")

//access Userdata
const Userdata = require('../models/Userdata');

//create seperate route handler for SignUp
const signupRouter = express.Router();

signupRouter.use(bodyparser.json());
const urlencodedParser = bodyparser.urlencoded({ extended: true });
signupRouter.use(urlencodedParser);

function router(nav){

    //GET Signup
    signupRouter.get('/',function(req,res){
        res.render('signup',
        {
            nav,
            title:'SIGNUP'
        });
    });

    //POST Signup
    signupRouter.post('/', urlencodedParser, 
        //rules 
        [
            check('fname','First Name is required')
                .isAlpha().withMessage('First Name must be of alphabets'),
            check('lname','Last Name is required')
                .isAlpha().withMessage('Last Name must be of alphabets'),
            check('email')
                .trim()
                .isEmail().withMessage('Invalid Email'),
                // .normalizeEmail(),
            check('password','Password is required')
                .isLength({ min: 8 }).withMessage('Password is required'),
            check('confirmpassword')
                .trim()
                .isLength({ min: 8 }).withMessage('Retype password')
                .custom(async (confirmPassword, {req})=>{
                    const password = req.body.password;
                    if(password != confirmPassword){ throw new Error('Password must match')}
                })
        ], 
        (request,response)=>{
            const { fname, lname, email } = request.body;
            // const data = matchedData(req)
            const errors = validationResult(request);
            // console.log(request.body);
            var alerts =errors.mapped();
            // console.log(alerts);
            if(!errors.isEmpty()){

                //render signup page with alerts
                response.render('signup',
                {
                    nav,
                    title:'SIGNUP',
                    'fname' : fname, 'lname' : lname, 'email' : email, //'err' : err,
                    alerts
                });
            }
            else{
                var err;
                //checks for email availability for signup
                Userdata.findOne({ user_email : email })
                .then(function(user){ // console.log(user);
                    if(user != null)
                    {// User exists with registering email
                        err = "Email Already Exists !!";
                        response.render('signup',
                        {
                            nav,
                            title:'SIGNUP',
                            'fname' : fname, 'lname' : lname, 'email' : email, 'err' : err,
                            alerts
                        })
                    }
                    else
                    {
                        //save signup data
                        //access query parameter values
                        var user_data = {
                            user_fname      : request.body.fname,
                            user_lname      : request.body.lname,
                            user_email      : request.body.email,
                            user_password   : request.body.password   
                        };
                        var user = Userdata(user_data);
                        user.save();
                        response.redirect('/login');
                    }
                })

                
            }
    });


    return signupRouter;
}

module.exports = router;