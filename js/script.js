/* getHashParams()
 * Obtains parameters from the hash of the URL
 * @return Object
 */
getHashParams = function() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
};

const app = {};

app.apiUrl = "https://api.spotify.com/v1";
app.token = "";
app.playlistID;
app.tracks;

const playlistName = "tracks_from_songcloud";

// Get the user's input
app.events = function(){
    $('form').submit('submit',function(e){
        e.preventDefault();

        let x = getHashParams();
        app.token = x.access_token ? x.access_token:"";
        console.log("getHashParams()");
        console.log(app.token);
        // Get query
        let title = $('input[type=search]').val();
/*            titles.map( (title) => app.searchTracks(title));
        app.searchPlaylistID(playlistName);*/
        $.when(app.searchTracks(title))
            .then(() => {
                let listItem = "";
                app.tracks.map( track => {
                    listItem += `
                    <li class="list-group-item list-group-item-dark">
                        <div class="track-container">
                            <div class="album-cover" style="background-image: url(${track.album.images[0].url}) ">
                                <div class="overlay"></div>
                            </div>
                            <div class="info">
                                <div class="song-title">${track.name}</div>
                                <div class="singer">${track.artists[0].name}</div>
                            </div>
                            <a href="#" id="${track.id}" class="add-track"><i class="fa fa-plus-circle"></i></a>
                        </div>
                    </li>`;
                });
                $("#list-track").html(listItem);
            });
    });
};



//
app.searchTracks = (tracksTitle) => $.ajax({
    url: `${app.apiUrl}/search`,
    method: 'GET',
    headers:{
        'Authorization': 'Bearer ' + app.token
    },
    dataType: 'json',
    data: {
        q: tracksTitle,
        type: 'track'
    },
    success: function(data){
        app.tracks = data.tracks.items;
        // app.tracks = app.tracks.map( (track) => track.uri ).join(",");
        console.log("ajax tracks");
        console.log(app.tracks);
    }
});

app.searchPlaylistID = (playlistName) => $.ajax({
    url: `${app.apiUrl}/search`,
    method: 'GET',
    headers:{
        'Authorization': 'Bearer ' + app.token
    },
    dataType: 'json',
    data: {
        q: playlistName,
        type: 'playlist'
    },
    success: function(data){
        app.playlistID = data.playlists.items[0];
        console.log("ajax playlistID");
        console.log(app.playlistID);
    }
});

// App
app.init = function(){
    app.events();
};
$(app.init);






