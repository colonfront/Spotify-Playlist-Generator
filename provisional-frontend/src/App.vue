<template>
  <div id="app">
    <a href="/login">login</a>
    <div>
      <input placeholder="searchForSong" @keyup.enter="search"/>
    </div>
    <div style="display:flex;">
      <div>
        <div>search results</div>
        <div style="display:flex;" v-for="track in searchResults" :key="track.id">
          <img width="100px" :src="track.art" />
          <div>
            <a :href="track.url">{{track.name}}</a>
            <div>by
              <a style="margin-right:8px;" v-for="artist in track.artists" :href="artist.url" :key="`${track.id}${artist.name}`">{{artist.name}}</a>
            </div>
            <button @click="add(track)">add</button>
          </div>
        </div>
      </div>
      <div>
        <div>selected</div>
        <button @click="generate">generate</button>
        <div style="display:flex;" v-for="track in selectedSongs" :key="track.id">
          <img width="100px" :src="track.art" />
          <div>
            <a :href="track.url">{{track.name}}</a>
            <div>by
              <a style="margin-right:8px;" v-for="artist in track.artists" :href="artist.url" :key="`${track.id}${artist.name}`">{{artist.name}}</a>
            </div>
            <button @click="remove(track)">remove</button>
          </div>
        </div>
      </div>
      <div>
        <div>generated</div>
        <div style="display:flex;" v-for="track in genResults" :key="track.id">
          <img width="100px" :src="track.art" />
          <div>
            <a :href="track.url">{{track.name}}</a>
            <div>by
              <a style="margin-right:8px;" v-for="artist in track.artists" :href="artist.url" :key="`${track.id}${artist.name}`">{{artist.name}}</a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button @click="exportPlaylist">export</button>
      </div>
      <div>
        generated playlist
        <a :href="generatedPlaylist.url">{{generatedPlaylist.name}}</a>
        <div>{{generatedPlaylist.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      selectedSongs: [],
      searchResults: [],
      genResults: [],
      generatedPlaylist:{"name":"","url":"","description":""},
    }
  },
  methods:{
    async generate(){
      var r  = await fetch("/api/sammify", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracks: this.selectedSongs.map(e => e.id),
        })
      })
      this.genResults = (await r.json())
    },
    remove(t){
        this.selectedSongs.splice(this.selectedSongs.findIndex(e => e.id === t.id), 1);
    },
    add(t){
      if (!this.selectedSongs.find(e => e.id === t.id)){ 
        this.selectedSongs.push(t) 
      }
    },
    async exportPlaylist() {
      var r  = await fetch("/api/generate-playlist", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracks: this.genResults.map(e => e.id),
        })
      })
      this.generatedPlaylist = (await r.json())
    },
    async search(e) {
      var r = await fetch(`/api/search?song=${e.target.value}`);
      this.searchResults = (await r.json())
    },
  }
}
</script>

<style>
</style>
