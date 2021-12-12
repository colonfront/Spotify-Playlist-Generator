var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var querystring = require('querystring');
require('dotenv').config();

const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = "http://localhost:8888/callback"


http.createServer(async function(req, res) {
    console.log(`${req.method} ${req.url}`)
    if (req.url == "/login") {
      exports.login(res)

    } else if (req.url.startsWith("/callback")) {
      exports.handleCallback(req, res)

    } else {
      exports.sendHomepage(req.url, res)
    }
}).listen(8888);

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath).map(e => `${dirPath}/${e}`)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(file).isDirectory()) {
      arrayOfFiles = getAllFiles(file, arrayOfFiles)
    } else {
      arrayOfFiles.push(file)
    }
  })

  return arrayOfFiles
}

exports.generateTrackObject = function (track) {
  return {
    "id": track.id,
    "name": track.name,
    "album": track.album.name,
    "url": track.external_urls.spotify,
    "art": track.album.images[1].url,
    "artists": track.artists.map(artist => { return {
      "name":artist.name,
      "url":artist.external_urls.spotify
    }})
  }
}

exports.getCookies = function (cookieHeader) {
  return url.parse("test?" + (cookieHeader.split("; ").join("&") || ""),true).query;
}

exports.sendHomepage = function(url, res) {
  var files = getAllFiles('./static');
  if (files.includes(`./static${url}`)){
    var readStream = fs.createReadStream(`./static${url}`);
    return readStream.pipe(res);
  }
  var readStream = fs.createReadStream("./static/index.html");
  return readStream.pipe(res);
}

exports.login = function(res) {
  var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  var state = generateRandomString(16);

  res.setHeader('Set-Cookie', `state=${state}; path=/;`)
  res.setHeader('location', 'https://accounts.spotify.com/authorize' +encodeURI(
      "?response_type=code" +
      `&client_id=${client_id}` +
      "&scope=user-read-private user-read-email playlist-modify-public" +
      `&redirect_uri=${redirect_uri}` +
      `&state=${state}`)
  );
  res.statusCode = 302;
  return res.end();
}
exports.handleCallback =function (req, res) {
  // get the code and state from url
  const queryObject = url.parse(req.url,true).query;
  var code = queryObject.code || null;
  var state = queryObject.state || null;

  // get the state from the cookie
  const cookies = exports.getCookies(req.headers.cookie)
  var storedState = cookies ? cookies.state: null;

  if (state === null || state !== storedState) { // something has gone wrong
      console.log(`something went wrong! cookie state:${storedState}, returned state:${state}`)
      res.writeHead(302, [
        ['Set-Cookie', `state=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`],
        ['location', '/']
      ])
      return res.end();
    }
    // set up getting the api token
    var authOptions = {
        hostname:"accounts.spotify.com",
        path:"/api/token",
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
          "Content-Type": "application/x-www-form-urlencoded"
        },
    };
    // make the request and store the access_token in the cookies
    preq = https.request(authOptions,  (pres) => {
        // console.log(`STATUS: ${pres.statusCode}`)
        // console.log(`HEADERS: ${JSON.stringify(pres.headers)}`)
      var result = ''
      pres.on('data', function (chunk) {
        result += chunk;
      });
      pres.on('end', function () {
          access_token_data = JSON.parse(result)
          // redirect to home when getting data
          res.writeHead(302, [
            ['Set-Cookie', `state=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`], // reset the state cookie
            ['Set-Cookie', `access_token=${access_token_data.access_token}; path=/;`], // set the access token cookie
            ['Set-Cookie', `refresh_token=${access_token_data.refresh_token}; path=/;`], // set the access token cookie
            ['location', '/'] // redirect to '/'
          ])
          res.end();
        });
    })
    // stringify getting the access token
    body = querystring.stringify({
      'code': code,
      'redirect_uri': redirect_uri,
      'grant_type': 'authorization_code'
    })
    preq.end(body)// write the body to the post request
}
exports.refreshToken = function (res, req) {
  return new Promise((resolve, reject) => {
    const cookies = exports.getCookies(req.headers.cookie)
    var refresh_token = cookies ? cookies.refresh_token: null;
    if (refresh_token === null) {
      reject()
    }
    // set up getting the api token
    var authOptions = {
        hostname:"accounts.spotify.com",
        path:"/api/token",
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
          "Content-Type": "application/x-www-form-urlencoded"
        },
    };
    // make the request and store the access_token in the cookies
    preq = https.request(authOptions,  (pres) => {
      var result = ''
      pres.on('data', function (chunk) {
        result += chunk;
      });
      pres.on('end', function () {
          access_token_data = JSON.parse(result)
          if (access_token_data.error) {
            console.log(access_token_data)
          }
          res.setHeader('Set-Cookie', `access_token=${access_token_data.access_token}; path=/;`)
          resolve(access_token_data.access_token)
        });
    })
    // stringify getting the access token
    body = querystring.stringify({
      'refresh_token': refresh_token,
      'grant_type': 'refresh_token'
    })
    preq.end(body)// write the body to the post request
  })
}