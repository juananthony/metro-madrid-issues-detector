moment.locale('es');

function getTweetText(tweet) {
    if(tweet.extended_tweet === undefined) return tweet.text;
    else return tweet.extended_tweet.full_text;
}

d3.json("/tweets/issues").then(data => {

    d3.select("#spinner").remove();
    
    var container = d3.select("body").append("div");

    var datesGroup = _.groupBy(data, function(tweet) {
        return moment(new Date(tweet.timestamp_ms)).startOf('day').format('LL');
    });

    datesGroup = Object.keys(datesGroup).map(function(key) {
        return [key, datesGroup[key]];
    });
    
    var uls = container
        .selectAll("div")
        .data(datesGroup)
        .enter()
        .append("div")
        .text(d => {return d[0]})
        .append("ul");
    
    uls.selectAll("ul")
        .data(d => _.sortBy(d[1], 'timestamp_ms'))
        .enter()
        .append("li")
        .append("a")
        .text(d => getTweetText(d));
        

});