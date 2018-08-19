module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    app.get('/unauthorized', function (req, res) {
        res.render('unauthorized.ejs');
    });


    app.get('/createProject', isLoggedIn, function (req, res) {
        res.render('createProject.ejs', {
            user: req.user
        });
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/createProject',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true //
    }));


};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/unauthorized');
}
