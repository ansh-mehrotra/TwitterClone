const express=require('express')
const app=express();
const router=express.Router();
const bcrypt=require('bcrypt');
const bodyParser=require('body-parser');
const User=require('../schemas/UserSchema');

app.set('view engine','pug');

//when you look for views (template) go to the folder called views.
app.set('views','views');

app.use(bodyParser.urlencoded({extended: false}));
router.get('/',(req,res,next)=>{
    res.status(200).render('login');
})

router.post('/',async (req,res,next)=>{

    var payload= req.body;

    if(req.body.logUsername && req.body.logPassword){
        var user= await User.findOne({    
            $or: [
                {username: req.body.logUsername},
                {email: req.body.logUsername},
            ]
        }) 
        .catch((error)=>{
            // console.log("hhhhh")
            console.log(error);
            payload.errorMessage='Something went wrong';
            res.status(400).render('login',payload);
        });

        if(user!=null){
           var result = await bcrypt.compare(req.body.logPassword,user.password);
            // console.log(result)
           if(result === true){
                // console.log("fafafaa")
                req.session.user=user;
                return res.redirect('/');
           }
        }

        payload.errorMessage='Login credentials doesn"t match';
        res.status(200).render('login',payload);
    }
    payload.errorMessage="Make sure each field has a valid value.";
    res.status(200).render('login');
})


module.exports=router;

