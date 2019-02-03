var METRO_MADRID_ACCOUNT_ID = 182764833;

moment.locale('es');

function onDataReceived() {
    d3.select("#spinner").remove();
    d3.select(".info").attr("class", "box info");
}

function getTweetText(tweet) {
    if(tweet.extended_tweet === undefined) return tweet.text;
    else return tweet.extended_tweet.full_text;
}

function getClassByClass(tweet) {
    if(tweet.classification.naive_bayes.result === 'issue') return 'metro-issue';
    else if(tweet.classification.naive_bayes.result === 'complaint') return 'metro-complaint';
}

function showTweet(tweet) {
    var coords = d3.mouse(this);
    console.log(coords);
    console.log(tweet);
}

d3.json("/tweets").then(data => {

    onDataReceived();
    
    var container = d3
        .select("body")
        .append("div")
        .attr("class", "element-container box");

    var nestedData = d3.nest()
        .key(d => moment(new Date(d.timestamp_ms)).format('dddd[,] LL'))
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

    // Adds user tweets
    var userTweetsDiv = hoursDiv.append("div").attr("class", "user-tweets");
    
    hoursDiv
        .append("h3")
        .text(d => d.key)
        .attr("class", "element-hour-title");
    
    var elementsDiv = userTweetsDiv.selectAll("div.element")
        .data(d => d.values)
        .enter()
        .filter(d => d.user.id != METRO_MADRID_ACCOUNT_ID)
        .append("div")
        .attr("class", d => "element " + "element-" + getClassByClass(d));

    elementsDiv.on("click", d => {
        showTweet(d);
    });

    // Add official tweets
    var officialsDiv = hoursDiv.append("div").attr("class", "official-tweets");

    var officialTweetsDiv = officialsDiv
        .selectAll("div.official-tweet")
        .data(d => d.values)
        .enter()
        .filter(d => d.user.id === METRO_MADRID_ACCOUNT_ID)
        .append("div")
        .attr("class", "official-tweet");
    
    officialTweetsDiv
        .append("img")
        .attr("class", "official-tweet-img")
        .attr("src", d => d.user.profile_image_url_https);

    var officialContainer = officialTweetsDiv
        .append("div")
        .attr("class", "official-tweet-container");
    
    var accountInfoDiv = officialContainer
        .append("div")
        .attr("class", "official-tweet-info");

    officialContainer.append("div").text(d => getTweetText(d));

    accountInfoDiv
        .append("div")
        .attr("class", "official-tweet-info-name")
        .text(d => d.user.name);
    accountInfoDiv
        .append("div")
        .attr("class", "official-tweet-info-screenname")
        .text(d => "@" + d.user.screen_name);
    accountInfoDiv
        .append("div")
        .attr("class", "official-tweet-info-time")
        .text(d => moment(new Date(d.timestamp_ms)).format('LT'));
    
    

});