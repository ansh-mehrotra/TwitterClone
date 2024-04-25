const express=require('express')
const app=express();
const port =3001;
const middleware=require('./middleware');
const path=require('path');
const bodyParser=require('body-parser');
const session=require('express-session');
const mongoose=require('./database')
const server=app.listen(port,()=>console.log('listening on port number',port));



app.set('view engine','pug');

//when you look for views (template) go to the folder called views.
app.set('views','views');

// app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret:'This part can be any string',
    resave:true,
    saveUninitialized:false,
}))
//Routes
const loginRoute=require('./routes/loginRoute');
const registerRoute=require('./routes/registerRoute');
const logoutRoute=require('./routes/logoutRoute');

//Api route
const postApiRoute=require('./routes/api/posts');


app.use('/login',loginRoute);
app.use('/register',registerRoute);
app.use('/logout',logoutRoute);
app.use('/api/posts',postApiRoute);

app.get('/',middleware.requireLogin, (req,res,next)=>{
    
    var payload={
        pageTitle: 'Home',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render('home',payload);
})
