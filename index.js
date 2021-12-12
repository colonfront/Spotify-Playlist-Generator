var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var querystring = require('querystring');
var utils = require("./utils");
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

    } else if (req.url.startsWith("/api/search")) {
      const cookies = utils.getCookies(req.headers.cookie)
      searchSong = url.parse(req.url,true).query.song;
      var result = await exports.searchSong(cookies.access_token, searchSong, res, req)
      res.end(JSON.stringify(result))

    } else if (req.url.startsWith("/api/generate-playlist") && req.method == "POST") {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      })
      req.on('end', async () => {
        const cookies = utils.getCookies(req.headers.cookie)
        jsondata = JSON.parse(data)
        var result = await exports.generatePlaylist(cookies.access_token, jsondata.tracks, res, req)
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result))
      })

    } else if (req.url == "/api/sammify" && req.method == "POST") {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      })
      req.on('end', async () => {
        const cookies = utils.getCookies(req.headers.cookie)
        jsondata = JSON.parse(data)
        var result = await exports.sammify(cookies.access_token, jsondata.tracks, jsondata.length || 20, res, req)
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result))
      })

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
  const cookies = utils.getCookies(req.headers.cookie)
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
    const cookies = utils.getCookies(req.headers.cookie)
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

function getSpotifyAPI(access_token, path, res, req){
  console.log(`new get request to: ${path}`)
  return new Promise((resolve, reject) => {
    var searchOptions = {
      hostname:"api.spotify.com",
      path:path,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token,
        "Content-Type": "application/json"
      },
    };
    // make the request and store the access_token in the cookies
    greq = https.request(searchOptions, (gres) => {
        // console.log(`STATUS: ${gres.statusCode}`)
        var result = ''
        gres.on('data', function (chunk) {
            result += chunk;
        });
        gres.on('end', async function () {
          json = JSON.parse(result)

          console.log(`${JSON.stringify(json).substring(0,200)}...`)
          if (json.error){
            if (json.error.message == "The access token expired"){
              var access_token = await exports.refreshToken(res, req)
              var result_search = await getSpotifyAPI(access_token, path, res, req)
              return resolve(result_search)
            }
            return reject(json)
          }
          resolve(json)
        });
    })
    greq.end()// write the body to the post request
  })
}

function postSpotifyAPI(access_token, path, body, res, req){
  console.log(`new post request to: ${path}`)
  return new Promise((resolve, reject) => {
    var searchOptions = {
      hostname:"api.spotify.com",
      path:path,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + access_token,
        "Content-Type": "application/json"
      },
    };
    // make the request and store the access_token in the cookies
    preq = https.request(searchOptions, (pres) => {
        // console.log(`STATUS: ${gres.statusCode}`)
        var result = ''
        pres.on('data', function (chunk) {
            result += chunk;
        });
        pres.on('end', async function () {
          json = JSON.parse(result)
          console.log(`${JSON.stringify(json).substring(0,200)}...`)
          if (json.error){
            if (json.error.message == "The access token expired"){
              var access_token = await exports.refreshToken(res, req)
              var result_search = await getSpotifyAPI(access_token, path, res, req)
              return resolve(result_search)
            }
            return reject(json)
          }
          resolve(json)
        });
    })
    preq.end(JSON.stringify(body))// write the body to the post request
  })
}

async function getArtistsTopFromTrack(access_token, track, res, req) {
  var json = await getSpotifyAPI(access_token, `/v1/tracks/${track}`, res, req)
  artistTT = []
  for (i in json.artists){
    var result = await getSpotifyAPI(access_token, `/v1/artists/${json.artists[i].href.split("/").pop()}/top-tracks?market=US`, res, req)
    artistTT = artistTT.concat(result.tracks)
  }
  return artistTT;
}

async function getArtistsTopFromTracks(access_token, tracks, res, req) {
  toptracks=[]
  for (i in tracks){
    var r = await getArtistsTopFromTrack(access_token, tracks[i], res, req)
    toptracks = toptracks.concat(r)
  }
  return toptracks;
}

async function avgPopularity(access_token, tracks, res, req) {
  total=0
  for (i in tracks){
    var json = await getSpotifyAPI(access_token, `/v1/tracks/${tracks[i]}`, res, req)
    total += json.popularity
  }
  return total/tracks.length;
}

exports.searchSong = async function(access_token, songName, res, req) {
  var json = await getSpotifyAPI(access_token, `/v1/search?type=track&include_external=audio&q=${encodeURI(songName)}`, res, req)
  return json.tracks.items.map(e => utils.generateTrackObject(e))
}

exports.generatePlaylist = async function(access_token, tracks, res, req){
  var user = await getSpotifyAPI(access_token, "/v1/me", res, req)
  var playlist = await postSpotifyAPI(access_token, `/v1/users/${user.id}/playlists`, {"name":"test", "description": "New playlist description","public": true}, res, req)
  await postSpotifyAPI(access_token, `/v1/playlists/${playlist.id}/tracks`, {"uris":tracks.map(e => `spotify:track:${e}`)}, res, req)
  return {"name":playlist.name, "url":playlist.external_urls.spotify, "description": playlist.description}
}

exports.sammify = async function(access_token, tracks, length, res, req) {
  results_recc = await getSpotifyAPI(access_token, `/v1/recommendations?seed_tracks=${tracks.join(",")}`, res, req)
  results_recc = results_recc.tracks
  results_artist = await getArtistsTopFromTracks(access_token, tracks, res, req)
  // return {"results_recc": results_recc, "results_artist":results_artist}
  results = results_recc.concat(results_artist)
  results = results.filter((v,i,s) => {return s.indexOf(v) === i})
  results.sort((a,b) => a.popularity - b.popularity) // least popular at results[0]
  average_popularity = await avgPopularity(access_token, tracks, res, req)
  // [0,1,2,3,4,5,6,7,8,9]
  // desired length is 4
  // if the avg pop was 1
  // getting 4 would mean getting the -1th element
  // so just get the bottom 4
  // same goes for top
  if (average_popularity <= results[Math.floor(length/2)].popularity){
    results = results.slice(0, length)
    return results.map(e => utils.generateTrackObject(e))
  }
  if (average_popularity >= results[results.length - Math.floor(length/2)].popularity){
    results = results.slice(results.length - length)
    return results.map(e => utils.generateTrackObject(e))
  }
  // only need to binary search between 2 and 8 (for example above)
  i=Math.floor(length/2)
  j=results.length - Math.floor(length/2),
  mid = 0
  aroundIndex = -1
  while(i<j){
    mid = Math.floor((i+j)/2)
    if (results[mid].popularity == average_popularity){
      aroundIndex = mid
      break;
    }
    // [0,1,2,3,4,5,6,7,8,9]
    // mid = 5
    // avg pop = 4.5
    // if 4.5 < 5 yes
    // if 4.5 > 4 yes
    // closest value is which ever is closest out of the two (in this case it doesnt matter so bias down)
    if (average_popularity < results[mid].popularity) {
      if (mid > 0 && average_popularity > results[mid-1].popularity){
        // if 4.5 - 5 > 4.5 - 4
        if (average_popularity - results[mid].popularity > average_popularity - results[mid-1].popularity){
          aroundIndex = mid
        } else {
          aroundIndex = mid-1
        }
        break;
      }
      j = mid
    } else {
      if (mid < results.length-1 && average_popularity < results[mid + 1].popularity) {
        if (average_popularity - results[mid].popularity > average_popularity - results[mid+1].popularity){
          aroundIndex = mid
        } else {
          aroundIndex = mid-1
        }
        break;
      }
      i = mid + 1
    }
  }
  if (aroundIndex == -1) aroundIndex = mid
  results = results.slice(aroundIndex-Math.floor(length/2),aroundIndex+Math.floor(length/2) + 1)
  // return results.map(e=> e.name + " by " + e.artists.map(a => a.name).join(", "))
  // return results
  return results.map(e => utils.generateTrackObject(e))
}