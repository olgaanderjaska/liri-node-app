var Twitter = require('twitter');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");


var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

 
var spotify = new Spotify({
  id: '97dfb176f2d640f489f992ade0b41ec8',
  secret: '18b1ad37c4c14f8a9659cb71465aa8dc'
});
 



var input = process.argv[2];
var title = getTitle();

if (input === "my-tweets" ) {
	getTweets();
} 
else if (input === "spotify-this-song") {
  
    if (title){
    	getSongs(title);
    } else {
    	getSongs("The Sign Ace Of Base");
    }
} else if (input === "movie-this"){

	if (title){
		getMovie(title);
	} else {
		getMovie("Mr. Nobody");
	}
} else if (input === "do-what-it-says") {
	fs.readFile('random.txt', "utf8", (err, data) => {
	  if (err) throw err;
	  data = data.split(",");

	  var inp = data[0];
	  var t = data[1];

	  if (inp === "my-tweets") {
	  	getTweets();
	  } 
	  else if (inp === "spotify-this-song"){
		   if (t) {
		  	getSongs(t);
		  } else {
		  	getSongs("The Sign Ace Of Base");
		  } 
	   }
	   else if (inp === "movie-this") 
	   {
        if (t) {
        	getMovie(t);
        } else {
        	getMovie("Mr. Nobody");
        }
	  }

	});
}




//==================================================================================
// FUNCTIONS
//==================================================================================

function getTweets(){
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	   //console.log(tweets);
	   for (var i = 0; i < 20; i++) {
	   	console.log("-----------------------------------------------------");
	   	console.log(tweets[i].text);
	   	console.log(tweets[i].created_at);
	   	console.log("-----------------------------------------------------");
	   	console.log("");
	   }
	  }
	});
} 


function getSongs(song){
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	 
		var song = data.tracks.items; 

		for (var i = 0; i < song.length; i++) {
			//song[i];
	   	    console.log("-----------------------------------------------------");
			console.log("SONG: " + song[i].name);
			console.log("ARTIST: " + song[i].artists[0].name);
			console.log("PREVIEW: " + song[i].preview_url);
			console.log("ALBUM: " + song[i].album.name);
		   	console.log("-----------------------------------------------------");
		   	console.log("");

		}

});

}



function getTitle(){

	var a = "";

	for (var i = 3; i < process.argv.length; i++) {
		
		a = a + " " + process.argv[i];

	}

	return a.trim();
}

function getMovie(movie){

   request("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
      if (!error && response.statusCode === 200) {
    
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
    console.log(JSON.parse(body).Title);
    console.log(JSON.parse(body).Year);
    console.log(JSON.parse(body).Ratings[1].Value);
    console.log(JSON.parse(body).Country);
    console.log(JSON.parse(body).Language);
    console.log(JSON.parse(body).Plot);
    console.log(JSON.parse(body).Actors);
  

  }
});
}