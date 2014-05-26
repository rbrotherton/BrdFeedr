var max       = 500;    // Maximum number of tweets to display on the page.  Script will prune tweets from the bottom (oldest) that exceed this number.
var count     = 100;    // Grab up to this number of new tweets on every refresh.  Twitter API caps this at 200.
var debug     = 0;      // Debug mode. 0 is production with live data & updates, 1 is debug mode with sample data.
var refresh   = 70000   // Refresh interval in miliseconds.  Must be at least 60000 (1 minute) to avoid Twitter API rate limiting.
var ran_once  = 0;      // Do not change, used by the script to indicate initial population vs updates
var latest_id = 1;      // Do not change, used by the script for more efficient refreshes.

// Execute when document is ready
$(document).ready(function() {
    
    // Initialize pretty pictures
    $(".fancybox").fancybox({padding:2,fixed:false});

    // Get data and start freshing
    refresh_display();
    if(debug == 0){
        setInterval("refresh_display()", refresh); // Check for new data
    }

});

// Get new data and add to DOM
function refresh_display(){
    // show_loading();
    // console.log("REFRESHING DISPLAY: Latest_id: "+ latest_id);
    if(debug == 1){
        $.getJSON('resources/sample_data.json', function(data){output(data)});
    } else {
        console.log(1);
        $.getJSON('get_tweets.php?since='+latest_id+'&count='+count, function(data){output(data)});
    }
}

// Add tweets to DOM
function output(tweets){    
    console.log(2);
    // Error handling...if you can call it that - TODO: Make this mnore graceful
    if(typeof tweets.errors !== 'undefined'){
        error_code = tweets.errors[0]['code'];
        error_msg  = tweets.errors[0]['message'];
        $("#container").prepend("<div class=\"tweet\"><b>Error "+error_code+": "+error_msg+"</div>");
    } else {

        var chunk = "";

        // Process each tweet received
        $.each(tweets, function(index, tweet){

            var html  = "";
            var user  = tweet['user'];

            // Generate clickable thumbnail images of media when present
            if(typeof tweet['entities']['media'] !== "undefined"){
                var media = tweet['entities']['media'][0];
                var thumb = "<td width=\"48\"><a class=\"fancybox\" href=\""+ media.media_url_https +"\"><img src=\""+ media.media_url_https +"\" class=\"thumb\" /></td>";
            } else {
                var thumb = "";
            } 

            // Timestamp generation 
            var secs = convert_timestamp(tweet.created_at);
            var created_at = "<span class=\"stamp\" data-livestamp=\""+ secs +"\"></span>";
            
            // Markup creations - TODO: Remove table?
            html += "<div class=\"tweet\" data-id=\""+ tweet.id +"\">";
            html += "   <table cellpadding=\"0\" cellspacing=\"0\"><thead></thead><tbody><tr>";
            html += "       <td valign=\"top\" width=\"48\"><img class=\"profile_image\" src=\""+ user.profile_image_url_https +"\" /></td>";
            html += "       <td valign=\"top\" class=\"content_column\">";
            html += "           <b>"+ user.name +"</b> &nbsp;&nbsp;";
            html += "           <span class=\"muted\"><a href=\"https://twitter.com/"+ user.screen_name +"\">@"+ user.screen_name +"</a> "+ created_at+"</span>";
            html += "           <div class=\"tweet_body\">"+ tweet.text +"</div>";
            html += "       </td>";
            html += thumb;
            html += "   </tr></tbody></table></div>";

            // Add to end, or save for prepending later
            if(ran_once == 0){
                $("#container").append(html);
            } else {
                if(tweet.id > latest_id){  // Hack to fix duplicates when no new data is found, unsure why it happens on occasion. 
                    chunk += html;
                } else {
                    // console.log("PREVENTED DUPLICATE OF "+ tweet.id);
                }
            }

            // Keep track of latest ID so we can fetch newer posts later
            // console.log("Tweet: "+tweet.id+ " ("+user.screen_name+") >? Latest: "+latest_id);
            if(tweet.id > latest_id){
                latest_id = tweet.id;
            }

        });
        
        // If this is a refresh after intial population we need to prepend the new stuff in reverse order (newest to oldest)                
        if(ran_once == 1){
            $(chunk).hide().prependTo("#container").slideDown(500);
        }

        // Convert text links to clickable hyperlinks
        parse_links();

        // Prune list of tweets
        prune_tweets();

    }

    // hide_loading();
    ran_once = 1;
}

// Display loading icon
function show_loading(){
    $('#loading').fadeIn(200);
    var k = setTimeout("hide_loading()", 5000); // Compensate for Twitter's occasional unresponsiveness
}

// Hide loading icon
function hide_loading(){
    $('#loading').fadeOut(200);
    $('#slow').css('display', 'none');
}

// Create hyperlinks from plain text 
function parse_links(){
    $('#container').ready(function(){
        $('.tweet_body').each(function(){
            var str = $(this).html();

            if(str.indexOf("<a href") == -1){
                var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig
                var replaced_text = str.replace(regex, "<a href='$1' target='_blank'>$1</a>");
                $(this).html(replaced_text);
            }
        });
    });
}

// Keep the document from getting too large during extended use
function prune_tweets(){

    var cnt = 0;
    $('.tweet').each(function(){
        if(cnt >= max){
            $(this).remove();
        }
        cnt++;
    });
}

// Convert "Thu May 01 13:01:04 +0000 2014" to seconds since epoch
// Have to do this since livestamp.js is deprecating ISO 8601 timestamp usage, prevents warnings being thrown
// TODO: Make this cleaner/less CPU intensive?
function convert_timestamp(stamp){
    var yr   = stamp.substring(26,30);
    var mo   = new Date(stamp.substring(4,7) +'-1-01').getMonth(); // Convert name to number (May to 5)
    var day  = stamp.substring(8,10);
    var hr   = stamp.substring(11,13);
    var min  = stamp.substring(14,16);
    var sec  = stamp.substring(17,19);
    var offset = new Date().getTimezoneOffset()*60; // Get local UTC offset in seconds
    var d = new Date(yr, mo, day, hr, min, sec, 0);
    
    if(offset > 0){
        var total_secs = (Date.parse(d)/1000)-offset;
    } else {
        var total_secs = (Date.parse(d)/1000)+offset;
    }

    return total_secs;
}