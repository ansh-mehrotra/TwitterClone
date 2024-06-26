const express=require('express')
const app=express();
const router=express.Router();
const bodyParser=require('body-parser');
const User=require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({extended: false}));

router.get('/',(req,res,next)=>{
    Post.find()
    .populate("postedBy")
    .sort({"createdAt":-1})
    .then(results=> res.status(200).send(results))
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })
})

router.post('/',async (req,res,next)=>{
    if(!req.body.content){
        console.log("content param not sent with request");
        return res.sendStatus(400);
    }
    
    var postData={
        content:req.body.content,
        postedBy:req.session.user,
    }

    Post.create(postData)
    .then(async newPost=>{
        newPost= await User.populate(newPost,{path: "postedBy"});

        res.status(201).send(newPost);
    })
    .catch(error=>{
        console.log(error);
        res.sendStatus(400);
    })
})

router.put('/:id/like',async (req,res,next)=>{
    var postId=req.params.id;
    var userId=req.session.user._id;
    // console.log(postId);
    var isLiked=req.session.user.likes && req.session.user.likes.includes(postId);
    var option = isLiked?"$pull":"$addToSet";

    // console.log("isLiked "+isLiked);
    // console.log("userId "+userId);
    // console.log("postId "+postId);
    // console.log("options "+option);
    
    //inserting User like
    req.session.user = await User.findByIdAndUpdate(userId,{ [option] :{ likes:postId }}, {new:true})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    //Inserting Post like
    var post = await Post.findByIdAndUpdate(postId,{ [option] :{ likes:userId }}, {new:true})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post);
    
})

router.post('/:id/retweet',async (req,res,next)=>{
    // return res.status(200).send("HELO");

    var postId=req.params.id;
    var userId=req.session.user._id;
    // console.log(postId);

    //try and delete post
    var deletedPost=await Post.findOneAndDelete({postedBy:userId ,retweetData:postId, })

    var option = deletedPost!=null ?"$pull":"$addToSet";
    var repost = deletedPost;

    if(repost == null){
        repost=Post.create({postedBy:userId, repostData:postId})
        .catch(error=>{
            console.log(error);
            res.sendStatus(400);
        })
    }
    return res.status(200).send(option);
    
    req.session.user = await User.findByIdAndUpdate(userId,{ [option] :{ retweets:repost._id }}, {new:true})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    var post = await Post.findByIdAndUpdate(postId,{ [option] :{ retweetUsers:userId }}, {new:true})
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post);
    
})


module.exports=router;

