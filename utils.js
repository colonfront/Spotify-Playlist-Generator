var url = require("url");

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