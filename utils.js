var url = require("url");
var https = require("https");

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

exports.getSpotifyAPI = function(access_token, path, res, req){
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
                var access_token = await authenication.refreshToken(res, req)
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
  
exports.postSpotifyAPI = function(access_token, path, body, res, req){
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
                var access_token = await authenication.refreshToken(res, req)
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