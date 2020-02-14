function createSongCloud() {
    $("#list-track").html("");
    $('#song-cloud').html("");
    var width = 900,
        height = 600;

    var fill = d3.scale.category20();

    //get db
    d3.json('https://spotify-auth-songcloud.herokuapp.com/tracks', (error, data) =>{
        if (error) {
            console.log(error);
            throw error;
        }

        data = data.tracks;
        

        var leaders = [];
        data.forEach(function(row){
            if (row.vote > 0) leaders.push({text: row.name, size: Number(row.vote), id: row.id});
        });
        var leaders = leaders.sort(function(a,b){
            return (a.size < b.size)? 1:(a.size == b.size)? 0:-1
        }).slice(0,30);

        var leaderScale = d3.scale.linear()
            .range([15,60])
            .domain([d3.min(leaders,function(d) { return d.size; }),
                    d3.max(leaders,function(d) { return d.size; })
                ]);

        d3.layout.cloud().size([width, height])
            .words(leaders)
            .padding(2)
            //.rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Tahoma")
            .fontSize(function(d) { return leaderScale(d.size); })
            .on("end", drawCloud)
            .start();
    });

    function drawCloud(words) {
        let index = 0;
        d3.select("#song-cloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate("+(width / 2)+","+(height / 2)+")")
            .selectAll("text")
            .data(words)
            .enter()
            .append("a")
            .attr("href", "#")
            .attr("onclick", function(d) { return `createPlayBack("${d.id}")`;} )
            .append("text").attr("data-toggle","tooltip").attr("title","play preview")
            .style("font-size", function(d) { return d.size + "px"; })
            // .style("font-family", "Saira")
            .style("font-weight", "bold")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { 
                console.log(index);
                index++;
                return d.text; });
    }


}

function createPlayBack(id){
    let iframe = `<iframe src="https://open.spotify.com/embed/track/${id}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    if (id === null) {
        iframe = "<p>Sorry this track didn't have preview</p>";
    }
    $("#create-spotify-playback").html(iframe);           
}