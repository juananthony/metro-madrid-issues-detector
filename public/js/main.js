moment.locale('es');

function getTweetText(tweet) {
    if(tweet.extended_tweet === undefined) return tweet.text;
    else return tweet.extended_tweet.full_text;
}

function getClassByClass(tweet) {
    if(tweet.classification.naive_bayes.result === 'issue') return 'metro-issue';
    else if(tweet.classification.naive_bayes.result === 'complaint') return 'metro-complaint';
}

d3.json("/tweets/userTweets").then(data => {

    d3.select("#spinner").remove();
    
    var container = d3.select("body").append("div");

    var datesGroup = _.groupBy(data, function(tweet) {
        return moment(new Date(tweet.timestamp_ms)).startOf('day').format('LL');
    });

    datesGroup = Object.keys(datesGroup).map(function(key) {
        return [key, datesGroup[key]];
    });
    
    var divs = container
        .selectAll("div")
        .data(datesGroup)
        .enter()
        .append("div")
    
    divs.append("h1")
        .text(d => {return d[0]})
        
    var uls = divs.append("ul");
    
    uls.selectAll("ul")
        .data(d => _.sortBy(d[1], 'timestamp_ms'))
        .enter()
        .append("li")
        .attr("class", d => getClassByClass(d))
        .append("a")
        .text(d => getTweetText(d));
        

});