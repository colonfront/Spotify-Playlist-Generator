# Spotify Playlist Generator

##

## Algorithm
- user inputs tracks (any number)
- get recommendations for each track
- get related artists for each track
    - get top tracks from each artist
- combine recommendations and related artist songs while removing duplicates
- sort tracks by popularity
- pick certain range around original track popularity
    - can be based on length
- generate playlistname based on mood and pull image from unsplash absed on mood/genres

## /api/search

### request
```
GET /api/search?song=SONGNAME
```
### response
```
[
    {
        id:string
        name:string,
        album:string,
        url:string (link to song spotify)
        art:string (album/track art link),
        artists:[
            {
                name:string,
                url:string (link to artist spotify)
            },
            ...
        ],

    },
    ...
]
```

### example /api/search?song=flashing%20lights
```
[{"id":"31I3Rt1bPa2LrE74DdNizO","name":"Flashing Lights","album":"Graduation","url":"https://open.spotify.com/track/31I3Rt1bPa2LrE74DdNizO","art":"https://i.scdn.co/image/ab67616d00001e029bbd79106e510d13a9a5ec33","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"},{"name":"Dwele","url":"https://open.spotify.com/artist/7u6LfVyYpEzMpHLL7jTyvU"}]},{"id":"4nUGTqmVL2z5Z6KHVU7pAx","name":"Flashing Lights","album":"Flashing Lights","url":"https://open.spotify.com/track/4nUGTqmVL2z5Z6KHVU7pAx","art":"https://i.scdn.co/image/ab67616d00001e02a98104c72b1f356bf97175c7","artists":[{"name":"Subjoi","url":"https://open.spotify.com/artist/5yP54uGWok9LAIYdH7tz5p"}]},{"id":"2AZADeVeBSQrYujU1iE2C6","name":"Flashing Lights","album":"Flashing Lights","url":"https://open.spotify.com/track/2AZADeVeBSQrYujU1iE2C6","art":"https://i.scdn.co/image/ab67616d00001e0220629e4024e97aa240e5b3ca","artists":[{"name":"Mikar-the-Vipar","url":"https://open.spotify.com/artist/4nJTywxeF2dCoVOfsXflLk"},{"name":"Young Free","url":"https://open.spotify.com/artist/0qYyy4D2KsVBqgnKSFBZJj"}]},{"id":"2QK4nswjBvmwBXTOLFodDA","name":"Flashing Lights","album":"Graduation","url":"https://open.spotify.com/track/2QK4nswjBvmwBXTOLFodDA","art":"https://i.scdn.co/image/ab67616d00001e02f1376598af09249b6d699f7c","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"4efFlbKkwXq3rrMF5RODaI","name":"Flashing Lights","album":"No More Idols","url":"https://open.spotify.com/track/4efFlbKkwXq3rrMF5RODaI","art":"https://i.scdn.co/image/ab67616d00001e024895aa42488369ec7f87ab91","artists":[{"name":"Chase & Status","url":"https://open.spotify.com/artist/3jNkaOXasoc7RsxdchvEVq"},{"name":"Sub Focus","url":"https://open.spotify.com/artist/0QaSiI5TLA4N7mcsdxShDO"},{"name":"Takura","url":"https://open.spotify.com/artist/5h7nWgcp5DTynhz4iaq0Ri"}]},{"id":"5TRPicyLGbAF2LGBFbHGvO","name":"Flashing Lights","album":"Graduation","url":"https://open.spotify.com/track/5TRPicyLGbAF2LGBFbHGvO","art":"https://i.scdn.co/image/ab67616d00001e0226f7f19c7f0381e56156c94a","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"},{"name":"Dwele","url":"https://open.spotify.com/artist/7u6LfVyYpEzMpHLL7jTyvU"}]},{"id":"7B5NyuAKnhLj0aasbRpaIp","name":"Flashing Lights","album":"Flashing Lights","url":"https://open.spotify.com/track/7B5NyuAKnhLj0aasbRpaIp","art":"https://i.scdn.co/image/ab67616d00001e02881a4b3e53c226a8dcb4d211","artists":[{"name":"Alan Fitzpatrick","url":"https://open.spotify.com/artist/40JyDxGqtYSowWYT2jaive"},{"name":"Bklava","url":"https://open.spotify.com/artist/71t5uC7AYxisT7Z55Y2Kqd"}]},{"id":"5g4J8GMYMWF2CUSDVhqWJR","name":"Flashing Lights","album":"Flashing Lights","url":"https://open.spotify.com/track/5g4J8GMYMWF2CUSDVhqWJR","art":"https://i.scdn.co/image/ab67616d00001e0261245ab23ef43de9af032f24","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"},{"name":"Dwele","url":"https://open.spotify.com/artist/7u6LfVyYpEzMpHLL7jTyvU"}]},{"id":"3jbaWxRwhXCZmvpPWHIKe3","name":"Flashing lights","album":"Flashing lights","url":"https://open.spotify.com/track/3jbaWxRwhXCZmvpPWHIKe3","art":"https://i.scdn.co/image/ab67616d00001e02f17c5e03c07ee92238bf6cb9","artists":[{"name":"Niels Wang","url":"https://open.spotify.com/artist/5CEH6P4vzHUyHI4WGrWaKT"}]},{"id":"4vLlGcrFYU1wgboZO874UY","name":"Flashing Lights","album":"Orange Lane","url":"https://open.spotify.com/track/4vLlGcrFYU1wgboZO874UY","art":"https://i.scdn.co/image/ab67616d00001e02bee5c0b573f677d1b886fc99","artists":[{"name":"Brookes Brothers","url":"https://open.spotify.com/artist/2FPeVdIIXD9Wb9Kbn1Hyz6"},{"name":"ShezAr","url":"https://open.spotify.com/artist/3PPJmIxohGjhNvQIyrksIW"},{"name":"Bossman Birdie","url":"https://open.spotify.com/artist/13sqxAHntdRq2aWVbuYmSg"}]},{"id":"1Qeq8sUkOkfV2kMclPSdO9","name":"Flashing Lights (Instrumental)","album":"Rock The Mic Vol.4","url":"https://open.spotify.com/track/1Qeq8sUkOkfV2kMclPSdO9","art":"https://i.scdn.co/image/f8d7b8a0f39d25d2df1061838f6e2102638fe0ba","artists":[{"name":"Hip Hop Beats","url":"https://open.spotify.com/artist/4CwOkihQOs7wpsUoKqkCrz"}]},{"id":"5Gx9PX9KhwofvOsdFaHVnN","name":"Flashing Lights","album":"HUMAN","url":"https://open.spotify.com/track/5Gx9PX9KhwofvOsdFaHVnN","art":"https://i.scdn.co/image/ab67616d00001e02eeaaf47e5ef2e89344a7a775","artists":[{"name":"Steve Angello","url":"https://open.spotify.com/artist/4FqPRilb0Ja0TKG3RS3y4s"},{"name":"Highly Sedated","url":"https://open.spotify.com/artist/14GNc5eQN6ia67v1ZhDMAv"}]},{"id":"3kcEit1QVu51lmPU3ZlW3H","name":"Flashing Lights","album":"Flashing Lights","url":"https://open.spotify.com/track/3kcEit1QVu51lmPU3ZlW3H","art":"https://i.scdn.co/image/ab67616d00001e0296293b0bdd694cf3b4240134","artists":[{"name":"LilDre","url":"https://open.spotify.com/artist/1IgesF4TXfosKeKfCwDC0w"}]},{"id":"1xU5X5umTmmyYAPuoRLyPd","name":"Flashing Lights","album":"Ultimate R&B 2008 (Double Album)","url":"https://open.spotify.com/track/1xU5X5umTmmyYAPuoRLyPd","art":"https://i.scdn.co/image/ab67616d00001e0294c061512e2f62f618651eb8","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"},{"name":"Dwele","url":"https://open.spotify.com/artist/7u6LfVyYpEzMpHLL7jTyvU"}]},{"id":"0Cto34sUKhfgdKyDVs4lfV","name":"Flashing Lights - Radio Edit","album":"Flashing Lights","url":"https://open.spotify.com/track/0Cto34sUKhfgdKyDVs4lfV","art":"https://i.scdn.co/image/ab67616d00001e02bf730b4ef03d513732ca464a","artists":[{"name":"Chase & Status","url":"https://open.spotify.com/artist/3jNkaOXasoc7RsxdchvEVq"},{"name":"Sub Focus","url":"https://open.spotify.com/artist/0QaSiI5TLA4N7mcsdxShDO"},{"name":"Takura","url":"https://open.spotify.com/artist/5h7nWgcp5DTynhz4iaq0Ri"}]},{"id":"4YJJgl2RIFaPZbfbXyzIvG","name":"Flashing Lights","album":"Flashing Lights","url":"https://open.spotify.com/track/4YJJgl2RIFaPZbfbXyzIvG","art":"https://i.scdn.co/image/ab67616d00001e0253ecf83d3ce54709967a7de4","artists":[{"name":"Subjoi","url":"https://open.spotify.com/artist/5yP54uGWok9LAIYdH7tz5p"}]},{"id":"0VATE0X1uLmlpEjKJQsfbz","name":"Flashing Lights - Remix","album":"Flashing Lights (Remix)","url":"https://open.spotify.com/track/0VATE0X1uLmlpEjKJQsfbz","art":"https://i.scdn.co/image/ab67616d00001e02ec39d245df3ef755b2e539f9","artists":[{"name":"KashOutKeise","url":"https://open.spotify.com/artist/5sRm5o4WHT0oNzovriKKx4"}]},{"id":"2EPRA9W4z0BYkBirMlWdZd","name":"Flashing Lights","album":"No Introduction Necessary [Deluxe Edition]","url":"https://open.spotify.com/track/2EPRA9W4z0BYkBirMlWdZd","art":"https://i.scdn.co/image/ab67616d00001e02cbd8f286e55ca0c0a9c56157","artists":[{"name":"Jimmy Page","url":"https://open.spotify.com/artist/55bGuHb50r5c0PeqqMeNBV"}]},{"id":"1861o0jjDqAl4yTFVNzcfk","name":"Flashing Lights - Original Mix","album":"Flashing Lights","url":"https://open.spotify.com/track/1861o0jjDqAl4yTFVNzcfk","art":"https://i.scdn.co/image/ab67616d00001e02d6af6d8546603f91c1a77bbb","artists":[{"name":"Laidback Luke","url":"https://open.spotify.com/artist/53cQZtWDwDJwVCNZlfJ6Qk"},{"name":"D.O.D","url":"https://open.spotify.com/artist/0Cs47vvRsPgEfliBU9KDiB"}]},{"id":"1Bz9Ogmoza0kliFExt6JvQ","name":"Flashing Lights - Live","album":"Essence Music Festival, Vol. 8","url":"https://open.spotify.com/track/1Bz9Ogmoza0kliFExt6JvQ","art":"https://i.scdn.co/image/ab67616d00001e023887b1954489c0ebbe99a007","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]}],
```

## /api/sammify

### request
```
POST /api/sammify
body: {tracks:[track_ids], length:int}
```
### response
```
[
    {
        id:string
        name:string,
        album:string,
        url:string (link to song spotify)
        art:string (album/track art link),
        artists:[
            {
                name:string,
                url:string (link to artist spotify)
            },
            ...
        ],

    },
    ...
]
```

### example /api/sammify body:
```
[{"id":"7F02x6EKYIQV3VcTaTm7oN","name":"Hey You","album":"The Wall","url":"https://open.spotify.com/track/7F02x6EKYIQV3VcTaTm7oN","art":"https://i.scdn.co/image/ab67616d00001e025d48e2f56d691f9a4e4b0bdf","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"29GefKRTSVW3ag4Xegm8jP","name":"Nikes On My Feet","album":"K.I.D.S.","url":"https://open.spotify.com/track/29GefKRTSVW3ag4Xegm8jP","art":"https://i.scdn.co/image/ab67616d00001e0250570144b4a9a459406f9a3d","artists":[{"name":"Mac Miller","url":"https://open.spotify.com/artist/4LLpKhyESsyAXpc4laK94U"}]},{"id":"2ctvdKmETyOzPb2GiJJT53","name":"Breathe (In the Air)","album":"The Dark Side of the Moon","url":"https://open.spotify.com/track/2ctvdKmETyOzPb2GiJJT53","art":"https://i.scdn.co/image/ab67616d00001e02ea7caaff71dea1051d49b2fe","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"3ZE3wv8V3w2T2f7nOCjV0N","name":"Life on Mars? - 2015 Remaster","album":"Hunky Dory (2015 Remaster)","url":"https://open.spotify.com/track/3ZE3wv8V3w2T2f7nOCjV0N","art":"https://i.scdn.co/image/ab67616d00001e02c657af8d545b4dcf432ace76","artists":[{"name":"David Bowie","url":"https://open.spotify.com/artist/0oSGxfWSnnOXhD2fKuz2Gy"}]},{"id":"2xyBvir9n474qfsOkxXMgx","name":"Flex","album":"Playboi Carti","url":"https://open.spotify.com/track/2xyBvir9n474qfsOkxXMgx","art":"https://i.scdn.co/image/ab67616d00001e02e31a279d267f3b3d8912e6f1","artists":[{"name":"Playboi Carti","url":"https://open.spotify.com/artist/699OTQXzgjhIYAHMy9RyPD"},{"name":"Leven Kali","url":"https://open.spotify.com/artist/5YZ5AExR68U3ZblH6HcO6B"}]},{"id":"3TO7bbrUKrOSPGRTB5MeCz","name":"Time","album":"The Dark Side of the Moon","url":"https://open.spotify.com/track/3TO7bbrUKrOSPGRTB5MeCz","art":"https://i.scdn.co/image/ab67616d00001e02ea7caaff71dea1051d49b2fe","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"5HNCy40Ni5BZJFw1TKzRsC","name":"Comfortably Numb","album":"The Wall","url":"https://open.spotify.com/track/5HNCy40Ni5BZJFw1TKzRsC","art":"https://i.scdn.co/image/ab67616d00001e025d48e2f56d691f9a4e4b0bdf","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"0vFOzaXqZHahrZp6enQwQb","name":"Money","album":"The Dark Side of the Moon","url":"https://open.spotify.com/track/0vFOzaXqZHahrZp6enQwQb","art":"https://i.scdn.co/image/ab67616d00001e02ea7caaff71dea1051d49b2fe","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"14XWXWv5FoCbFzLksawpEe","name":"Riders on the Storm","album":"L.A. Woman","url":"https://open.spotify.com/track/14XWXWv5FoCbFzLksawpEe","art":"https://i.scdn.co/image/ab67616d00001e0220783882533e669760741df2","artists":[{"name":"The Doors","url":"https://open.spotify.com/artist/22WZ7M8sxp5THdruNY3gXt"}]},{"id":"63OQupATfueTdZMWTxW03A","name":"Karma Police","album":"OK Computer","url":"https://open.spotify.com/track/63OQupATfueTdZMWTxW03A","art":"https://i.scdn.co/image/ab67616d00001e02c8b444df094279e70d0ed856","artists":[{"name":"Radiohead","url":"https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb"}]},{"id":"6mFkJmJqdDVQ1REhVfGgd1","name":"Wish You Were Here","album":"Wish You Were Here","url":"https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1","art":"https://i.scdn.co/image/ab67616d00001e021a84d71391df7469c5ab8539","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"4gMgiXfqyzZLMhsksGmbQV","name":"Another Brick in the Wall, Pt. 2","album":"The Wall","url":"https://open.spotify.com/track/4gMgiXfqyzZLMhsksGmbQV","art":"https://i.scdn.co/image/ab67616d00001e025d48e2f56d691f9a4e4b0bdf","artists":[{"name":"Pink Floyd","url":"https://open.spotify.com/artist/0k17h0D3J5VfsdmQ1iZtE9"}]},{"id":"50a8bKqlwDEqeiEknrzkTO","name":"ball w/o you","album":"i am > i was","url":"https://open.spotify.com/track/50a8bKqlwDEqeiEknrzkTO","art":"https://i.scdn.co/image/ab67616d00001e02280689ecc5e4b2038bb5e4bd","artists":[{"name":"21 Savage","url":"https://open.spotify.com/artist/1URnnhqYAYcrqrcwql10ft"}]},{"id":"3sNVsP50132BTNlImLx70i","name":"Bound 2","album":"Yeezus","url":"https://open.spotify.com/track/3sNVsP50132BTNlImLx70i","art":"https://i.scdn.co/image/ab67616d00001e021dacfbc31cc873d132958af9","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"4KW1lqgSr8TKrvBII0Brf8","name":"Father Stretch My Hands Pt. 1","album":"The Life Of Pablo","url":"https://open.spotify.com/track/4KW1lqgSr8TKrvBII0Brf8","art":"https://i.scdn.co/image/ab67616d00001e022a7db835b912dc5014bd37f4","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"4EWCNWgDS8707fNSZ1oaA5","name":"Heartless","album":"808s & Heartbreak","url":"https://open.spotify.com/track/4EWCNWgDS8707fNSZ1oaA5","art":"https://i.scdn.co/image/ab67616d00001e02346d77e155d854735410ed18","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"31I3Rt1bPa2LrE74DdNizO","name":"Flashing Lights","album":"Graduation","url":"https://open.spotify.com/track/31I3Rt1bPa2LrE74DdNizO","art":"https://i.scdn.co/image/ab67616d00001e029bbd79106e510d13a9a5ec33","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"},{"name":"Dwele","url":"https://open.spotify.com/artist/7u6LfVyYpEzMpHLL7jTyvU"}]},{"id":"4Li2WHPkuyCdtmokzW2007","name":"Ni**as In Paris","album":"Watch The Throne (Deluxe)","url":"https://open.spotify.com/track/4Li2WHPkuyCdtmokzW2007","art":"https://i.scdn.co/image/ab67616d00001e024a767758e8ebe2443591c9fd","artists":[{"name":"JAY-Z","url":"https://open.spotify.com/artist/3nFkdlSjzX9mRTtwJOzDYB"},{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"7CC6UbCs4iGsePSzFxYxNn","name":"Moon","album":"Donda","url":"https://open.spotify.com/track/7CC6UbCs4iGsePSzFxYxNn","art":"https://i.scdn.co/image/ab67616d00001e02cad190f1a73c024e5a40dddd","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"4fzsfWzRhPawzqhX8Qt9F3","name":"Stronger","album":"Graduation","url":"https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3","art":"https://i.scdn.co/image/ab67616d00001e029bbd79106e510d13a9a5ec33","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]},{"id":"6LNoArVBBVZzUTUiAX2aKO","name":"Off The Grid","album":"Donda","url":"https://open.spotify.com/track/6LNoArVBBVZzUTUiAX2aKO","art":"https://i.scdn.co/image/ab67616d00001e02cad190f1a73c024e5a40dddd","artists":[{"name":"Kanye West","url":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"}]}]
```