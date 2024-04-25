//to check if the user is currently logged in or not.
exports.requireLogin=(req,res,next)=>{
if(req.session && req.session.user)
    return next();
else
    return res.redirect('/login');
}