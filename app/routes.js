var multer = require('multer');
var upload = multer({dest: 'upload'});
var fs = require('fs');
var Project = require('../app/models/projects');
var Criteria = require('../app/models/criteria');
var Participant = require('../app/models/participant');
module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('Home.ejs', {message: ""});
    });
    app.get('/upload', function (req, res) {
        res.render('uploadData.ejs', {message: ""});
    });
    app.get('/about', function (req, res) {
        res.render('about.ejs', {message: ""});
    });
    app.get('/runExperiment', function (req, res) {
        res.render('runExperiment.ejs', {message: ""});
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
            res.json({"message":"Login succesfful"});
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
    app.post('/saveParticipant', function (req, res) {
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
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true //
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
            res.render('index.ejs', {message: 'File uploaded successfully', uploaded_file_url: fn})
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
