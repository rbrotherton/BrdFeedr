<?php
    session_start();
    require_once('TwitterAPIExchange.php');
    require_once('auth/config.php');

    $access_token = $_SESSION['access_token'];

    // Auth
    // Consumer = API
    $settings = array(
        'oauth_access_token' => $access_token['oauth_token'],
        'oauth_access_token_secret' => $access_token['oauth_token_secret'],
        'consumer_key' => CONSUMER_KEY,
        'consumer_secret' => CONSUMER_SECRET
    );

    // Which API are we hitting - REST 1.1 User based home timeline
    $url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
    
    // Choose our query
    if(isset($_GET['since'])){
    	$getfield = '?count='.$_GET['count'].'&since_id='.$_GET['since'].'&screen_name='.$_SESSION['screen_name'];
    } else {
    	$getfield = '?count='.$_GET['count'].'&screen_name='.$_SESSION['screen_name'];
    }

    // Send it
    $requestMethod = 'GET';
    $twitter = new TwitterAPIExchange($settings);
	$results = $twitter->setGetfield($getfield)
                       ->buildOauth($url, $requestMethod)
                       ->performRequest();

    // Output
 	echo $results;
?>