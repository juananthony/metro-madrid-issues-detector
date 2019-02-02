moment.locale('es');

function getTweetText(tweet) {
    if(tweet.extended_tweet === undefined) return tweet.text;
    else return tweet.extended_tweet.full_text;
}

function getClassByClass(tweet) {
    if(tweet.classification.naive_bayes.result === 'issue') return 'metro-issue';
    else if(tweet.classification.naive_bayes.result === 'complaint') return 'metro-complaint';
}

function showTweet(tweet) {
    console.log(tweet);
}

d3.json("/tweets/userTweets").then(data => {

    d3.select("#spinner").remove();
    
    var container = d3
        .select("body")
        .append("div")
        .attr("class", "element-container");

    var nestedData = d3.nest()
        .key(d => moment(new Date(d.timestamp_ms)).format('LL'))
        .key(d => moment(new Date(d.timestamp_ms)).format('HH'))
        .entries(data);

    var datesDiv = container
        .selectAll("div.element-date")
        .data(nestedData)
        .enter()
        .append("div")
        .attr("id", d => d.key)
        .attr("class", "element-date");
    
    datesDiv
        .append("h2")
        .text(d => d.key)
        .attr("class", "element-date-title");
    

    var tweetsDiv = datesDiv
        .append("div")
        .attr("class","element-date-tweets");
    
    var hoursDiv = tweetsDiv.selectAll("div.element-hour")
        .data(d => d.values)
        .enter()
        .append("div")
        .attr("class","element-hour");

    var userTweetsDiv = hoursDiv.append("div").attr("class", "user-tweets");
    
    hoursDiv
        .append("h3")
        .text(d => d.key)
        .attr("class", "element-hour-title");

    var officialTweetsDiv = hoursDiv.append("div").attr("class", "official-tweets");
    
    var elementsDiv = userTweetsDiv.selectAll("div.element")
        .data(d => d.values)
        .enter()
        .append("div")
        .attr("class", d => "element " + "element-" + getClassByClass(d));
    
    elementsDiv.on("mouseover", d => {
        showTweet(d);
    });

});