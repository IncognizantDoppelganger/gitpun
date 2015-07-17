var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  express = require('express'),
  db = require('./db/config'),
  reposController = require('./repos/reposController'),
  commitsController = require('./commits/commitsController'),
  authController = require('./auth/authController.js'),
  request = require('request'),
  fs = require('fs'),
  passport = require('./auth/authController').passport;

var app = express();

var router = new express.Router();
//These seem unnecessary for our purposes
//var usersRouter = new express.Router();
//var reposRouter = new express.Router();
//var commitsRouter = new express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
var server = app.listen(process.env.PORT || 3000, function(){
  console.log('listening to port: ' + 3000);
});

app.use(passport.initialize());
app.use(passport.session());

//ROUTES-------------------------
app.get('/getAccessToken',
  passport.authenticate('github', { failureRedirect: '/pageNotFound' }),
  function(req, res){
    repoFullName = req.query.repoFullName;
    console.log(repoFullName);
    res.redirect('/');
  }
);

app.get('/repos/:repoOwner/:repoName/commits',
  function(req, res, next) {
    // console.log(req.session);

    authController.gitHubLogin(req, res, next);
    // req.session.redirect = req.query.redirect
    // next();
  },
  passport.authenticate('github', function(req, res){})
);

//commitsController.getCommits);
//app.get('/repos/:repoOwner/:repoName', reposController.getRepo);
//app.get('/:user/repos/:repo', reposController.getRepo); //get a user's repo with possible filters
//app.get('/:user/repos', reposController.getRepos) //get a list of user's repos
//app.get('/:user', usersController.getUser); //get a user

// app.get('/auth', authController.gitHubLogin);
// app.get('/getAccessToken', authController.getAccessToken);
//-------------------------------

//app.use('/users', usersRouter);
//app.use('/repos', reposRouter);
//app.use('/commits', commitsRouter);

//require('./users/usersRoutes.js') (usersRouter);
//require('./repos/reposRoutes.js') (reposRouter);
//require('./commits/commitsRoutes.js') (commitsRouter);
// require('db/events/commitsRoutes.js') (commitsRouter);

// new Commit({sha: '123', user: 'dani'}).save().then(function(commit) {
//   console.log('saved commit: ', commit);
// });

exports.export = {server: server, app:app};
