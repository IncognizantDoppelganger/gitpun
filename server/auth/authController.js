var fs = require('fs');
var request = require('request');

var client_id; //client key
var client_secret; //client secret
var base_URL = process.env.PRODUCTION ? 'http://gitualize.com' : 'http://localhost:3000';

var gitHubLogin = function(req, res) { //redirects to github login
  console.log('auth controller login');
  // console.log('req.params.repoFullName: ', req.params);
  //console.log('req.query.repoFullName: ', req.query.repoFullName);
  fs.readFile('./client/secret.json', function(err, data){
    var body = JSON.parse(data);
    client_id = body.client_id;
    client_secret = body.client_secret;
    var redirectUrl = base_URL + '/getAccessToken?repoFullName='+req.query.repoFullName;
    //TODO fix this horribleness, even worse cuz https doesn't work
    console.log('going to github/oauth/authorize');
    res.redirect('https://github.com/login/oauth/authorize?client_id=' + client_id + '&redirect_uri=' + redirectUrl);
    //var githubOauthUrl = 'https://github.com/login/oauth/authorize?client_id=' + client_id + '&redirect_uri=' + redirectUrl;
    //res.json({msg: 'accessToken required', authUrl: githubOauthUrl});
  });
};

//if we moved this to a route on our client it would prolly work as expected
var getAccessToken = function(req, res) { //redirects back to our client page
  var code = req.query.code;
  request.post({
    url: 'https://github.com/login/oauth/access_token?client_id=' + client_id +'&client_secret=' + client_secret + '&code=' + code
  }, function(err, response, body){
    // console.log('github body: ', body);
    var accessToken = body.slice(body.indexOf('=') + 1, body.indexOf('&'));
    console.log('got access token');
    //TODO horrible
    //res.json({msg: 'authed', accessToken: accessToken, msg2: 'please go to /#/repo/' + req.query.repoFullName + '?accessToken=' + accessToken});
    //res.json({msg: 'authed', accessToken: accessToken, msg2: 'please go to /#/repo/' + req.query.repoFullName + '?accessToken=' + accessToken});

    //but also don't redirect on the server!!
   //res.redirect('http://google.com');
   res.redirect(base_URL + '/#/repo/' + req.query.repoFullName + '?accessToken=' + accessToken);
    //res.redirect('/repos/' + req.query.repoFullName + '/commits?accessToken=' + accessToken);
  });
};//, commitsController.getCommits);

module.exports = {gitHubLogin: gitHubLogin, getAccessToken: getAccessToken};
