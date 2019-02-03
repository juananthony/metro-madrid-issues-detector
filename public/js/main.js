var METRO_MADRID_ACCOUNT_ID = 182764833,
    TWITTER_URL = "https://twitter.com/";

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
    d3.event.preventDefault();
    var tweetBox = document.createElement("DIV");
    tweetBox.setAttribute("class", "user-tweet-example");

    var closeButton = document.createElement("DIV");
    closeButton.appendChild(document.createTextNode("X"));
    closeButton.setAttribute("class", "user-tweet-example-close");
    closeButton.addEventListener("click", event => onCloseExampleTweet(closeButton, event));

    var imgDiv = document.createElement("DIV");
    imgDiv.setAttribute("class", "user-tweet-example-img");

    var img = document.createElement("IMG");
    img.setAttribute("src", tweet.user.profile_image_url_https);
    imgDiv.appendChild(img);

    var contentDiv = document.createElement("DIV");
    contentDiv.setAttribute("class", "user-tweet-example-content");
    var infoDiv = document.createElement("DIV");
    infoDiv.setAttribute("class", "user-tweet-example-info");
    var textDiv = document.createElement("DIV");
    textDiv.setAttribute("class", "user-tweet-example-info-text");
    var text = document.createTextNode(getTweetText(tweet));
    textDiv.appendChild(text);

    var aEl = document.createElement("A");
    aEl.setAttribute("href", TWITTER_URL + tweet.user.screen_name + "/status/" + tweet.id_str);
    aEl.setAttribute("target", "_blank");
    aEl.setAttribute("rel", "noopener noreferrer");
    aEl.appendChild(document.createTextNode("Abrir en Twitter"));
    textDiv.appendChild(aEl);

    var screenname = document.createElement("DIV");
    screenname.setAttribute("class", "user-tweet-example-screenname");
    screenname.appendChild(document.createTextNode(tweet.user.screen_name));
    infoDiv.appendChild(screenname);

    var tweetDate = document.createElement("DIV");
    tweetDate.setAttribute("class", "user-tweet-example-date");
    tweetDate.appendChild(document.createTextNode(moment(new Date(tweet.timestamp_ms)).format('LT')));
    infoDiv.appendChild(tweetDate);

    contentDiv.appendChild(infoDiv);
    contentDiv.appendChild(textDiv);

    tweetBox.appendChild(imgDiv);
    tweetBox.appendChild(contentDiv);
    tweetBox.appendChild(closeButton);

    document.getElementById(tweet.id_str).parentNode.appendChild(tweetBox);

    console.log(tweet);
}

function onCloseExampleTweet(el, event) {
    event.preventDefault()
    el.parentNode.parentNode.removeChild(el.parentNode);
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
        .attr("id", d => d.id_str)
        .attr("class", d => "element " + "element-" + getClassByClass(d));

    elementsDiv.on("click", d => {
        showTweet(d, elementsDiv);
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
        .attr("class", "official-tweet-info only-desktop");

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