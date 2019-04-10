module.exports = (req, res, next) => {
    //if the session isLoggedIn is false then redirect to login page or email isn't confirmed
    if (!req.session.isLoggedIn || !req.session.user.isEmailConfirmed) {
        if(!req.session.isLoggedIn){
            req.flash('error','The session time out. Please login.');
        }
        if(!req.session.isEmailConfirmed){
            req.flash('error','The email must be confirmed for the first time. Please do check your email folders.');
        }
        
        return res.redirect('/login');
    }
    next();
}