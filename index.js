var http = require("http");
var url = require("url");
var fs = require("fs");
var utils = require("./utils");
var authenication = require("./authentication");

http.createServer(async function(req, res) {
    console.log(`${req.method} ${req.url}`)
    if (req.url == "/login") {
      authenication.login(res)

    } else if (req.url.startsWith("/callback")) {
      authenication.handleCallback(req, res)

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
        if (jsondata.tracks.length === 0){
          return res.end(JSON.stringify({"error":"no tracks supplied"}))
        }
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



async function getArtistsTopFromTrack(access_token, track, res, req) {
  var json = await utils.getSpotifyAPI(access_token, `/v1/tracks/${track}`, res, req)
  artistTT = []
  for (i in json.artists){
    var result = await utils.getSpotifyAPI(access_token, `/v1/artists/${json.artists[i].href.split("/").pop()}/top-tracks?market=US`, res, req)
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
    var json = await utils.getSpotifyAPI(access_token, `/v1/tracks/${tracks[i]}`, res, req)
    total += json.popularity
  }
  return total/tracks.length;
}

exports.searchSong = async function(access_token, songName, res, req) {
  var json = await utils.getSpotifyAPI(access_token, `/v1/search?type=track&include_external=audio&q=${encodeURI(songName)}`, res, req)
  return json.tracks.items.map(e => utils.generateTrackObject(e))
}

exports.generatePlaylist = async function(access_token, tracks, res, req){
  var user = await utils.getSpotifyAPI(access_token, "/v1/me", res, req)
  var playlist = await utils.postSpotifyAPI(access_token, `/v1/users/${user.id}/playlists`, {"name":"test", "description": "New playlist description","public": true}, res, req)
  await utils.postSpotifyAPI(access_token, `/v1/playlists/${playlist.id}/tracks`, {"uris":tracks.map(e => `spotify:track:${e}`)}, res, req)
  return {"name":playlist.name, "url":playlist.external_urls.spotify, "description": playlist.description}
}

exports.sammify = async function(access_token, tracks, length, res, req) {
  results_recc = await utils.getSpotifyAPI(access_token, `/v1/recommendations?seed_tracks=${tracks.join(",")}`, res, req)
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