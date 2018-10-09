var multer = require('multer');
var upload = multer({dest: 'upload'});
var fs = require('fs');
var Project = require('../app/models/projects');
var Criteria = require('../app/models/criteria');
var User = require('../app/models/user');
var Participant = require('../app/models/participant');
const LocalStrategy = require('passport-local').Strategy;
module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('Home.ejs', {message: ""});
    });
    app.get('/upload', isLoggedIn, function (req, res) {
        res.render('uploadData.ejs', {message: ""});
    });
    app.get('/about', function (req, res) {
        res.render('about.ejs', {message: ""});
    });
    app.get('/runExperiment', isLoggedIn, function (req, res) {
        res.render('runExperiment.ejs', {message: ""});
    });
    app.get('/listCriteria', isLoggedIn, function (req, res) {
        res.render('AnalysisCriteria.ejs', {message: ""});
    });
    app.get('/listProject', isLoggedIn, function (req, res) {
        res.render('listProjects.ejs', {message: ""});
    });
    app.get('/projectParticipants', isLoggedIn, function (req, res) {
        res.render('ProjectParticipants.ejs', {message: ""});
    });
    app.get('/multiUpload', isLoggedIn, function (req, res) {
        res.render('AddDataset.ejs', {message: ""});
    });

    app.get('/unauthorized', function (req, res) {
        res.render('unauthorized.ejs');
    });


    app.get('/createProject', isLoggedIn, function (req, res) {
        res.render('AddNewProjects.ejs', {
            message: "",
            user: req.user
        });
    });
    app.get('/manageProject', isLoggedIn, function (req, res) {
        res.render('manageProjects.ejs', {
            message: "",
            user: req.user
        });
    });
    app.get('/addCriteria', isLoggedIn, function (req, res) {
        res.render('AddCriteria.ejs', {
            message: "",
            user: req.user
        });
    });
    app.get('/addParticipant', isLoggedIn, function (req, res) {
        res.render('AddNewParticipants.ejs', {
            message: "",
            user: req.user
        });
    });
    app.get('/projectList', isLoggedIn, function (req, res) {

        Project.find({userId:req.user._id},function(err,projects){
            if (err) return handleError(err);
            res.json(projects);
        });


    });
    app.get('/criteriaList', isLoggedIn, function (req, res) {
    console.log("criteria list");
        Criteria.find({userId:req.user._id},function(err,criterias){
            if (err) return handleError(err);
            res.json(criterias);
        });


    });
    app.get('/participantList', isLoggedIn, function (req, res) {
        Participant.find({userId:req.user._id},function(err,participant){
            if (err) return handleError(err);
            res.json(participant);
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
        res.render('signup.ejs', {message: ""});
    });
    app.post('/saveProject', function (req, res) {
        if (req && req.body) {

            req.body.userId = req.user._id;
            var projectInstance = new Project(req.body);

            // Save the new model instance, passing a callback
            projectInstance.save(function (err) {
                if (err) return handleError(err);
                // saved!
            });

            res.render('AddNewProjects.ejs', {
                message: "Project Successfully Saved",
                user: req.user
            });
        }

    });
    app.post('/saveCriteria', function (req, res) {
        if (req && req.body) {
            req.body.userId = req.user._id;
            var criteriaInstance = new Criteria(req.body);

            // Save the new model instance, passing a callback
            criteriaInstance.save(function (err) {
                if (err) return handleError(err);
                // saved!
            });

            res.render('AddCriteria.ejs', {
                message: "Criteria Successfully Saved",
                user: req.user
            });
        }

    });
    app.post('/saveParticipant', isLoggedIn, function (req, res) {
        if (req && req.body) {
            console.log("request", req.body);
            req.body.userId = req.user._id;
            var participant = new Participant(req.body);

            // Save the new model instance, passing a callback
            participant.save(function (err) {
                if (err) return handleError(err);
                // saved!
            });

            res.render('AddNewParticipants.ejs', {
                message: "Participant Added Successfully",
                user: req.user
            });
        }

    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/createProject',
        failureRedirect: '/signup',
        failureFlash: true //
    }));
    passport.use( 'signup',new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({email: email},function(err, user) {
                    // In case of any error return
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists');
                        return done(null, false, {message:'user already exists'});
                    } else {
                        // if there is no user with that email
                        // create the user

                        var newUser = new User();
                        // set the user's local credentials

                        newUser.password = createHash(req.param('password'));
                        newUser.email = req.param('email');

                        console.log(newUser.name);
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    app.post('/fileUpload', upload.single('myfile'), function (req, res, next) {
        /** When using the "single"
         data come in "req.file" regardless of the attribute "name". **/
        var tmp_path = req.file.path;

        /** The original name of the uploaded file
         stored in the variable "originalname". **/
        var target_path = 'upload/' + req.file.originalname;
        var fn = req.file.originalname;
        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function () {
            res.render('uploadData.ejs', {message: 'File uploaded successfully', uploaded_file_url: fn})
        });
        src.on('error', function (err) {
            res.render('error');
        });

    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/unauthorized');
}
