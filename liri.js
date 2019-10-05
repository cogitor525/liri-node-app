// read and set any environment variables with the dotenv package
require("dotenv").config();

// import the `keys.js` file
var keys = require("./keys.js");

const axios = require('axios');

let command = process.argv[2];
// the 'query' (4th CL argument) needs to be in quotes (" ")
let query = process.argv[3];

function runCommand() {
    switch(command) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            // code
            break;
        case "movie-this":
            // code
            break;
        case "do-what-it-says":
            // code
            break;
        default:
            console.log("Invalid command");
    }
}

runCommand();

// commands for liri.js
// ====================
//  * `node liri.js concert-this <artist/band name here>`
//      This will search the Bands in Town Artist Events API:
//      (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`)
//      for an artist and render the following information about each event to the terminal:
//          * Name of the venue
//          * Venue location
//          * Date of the Event (use moment to format this as "MM/DD/YYYY")

function concertThis() {
    if (!query) {
        query = "Muse";
    }
    const url = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";

    function Event(venue, location, date) {
        this.venue = venue;
        this.location = location;
        this.date = date;
    }

    axios.get(url)
        .then(function(response) {
            const data = response.data;
            const events = data.map(function(currentValue, index) {
                const venue = currentValue.venue.name;
                const location = currentValue.venue.city + ", " + currentValue.venue.country;
                const date = currentValue.datetime;
                return new Event(venue, location, date); 
            });
            console.log(events[0]);
            console.log(events[4]);
        })
        .catch(function(error) {
            console.log(error);
        })
        .finally(function() {
            console.log("finally code here");
        });
}

//  * `node liri.js spotify-this-song '<song name here>'`
//      This will show the following information about the song in your terminal/bash window
//          * Artist(s)
//          * The song's name
//          * A preview link of the song from Spotify
//          * The album that the song is from
//          * If no song is provided then your program will default to "The Sign" by Ace of Base.
//      *** can access keys information with following ***
//          var spotify = new Spotify(keys.spotify);
//
//  * `node liri.js movie-this '<movie name here>'`
//      This will output the following information to your terminal/bash window:
//          * Title of the movie.
//          * Year the movie came out.
//          * IMDB Rating of the movie.
//          * Rotten Tomatoes Rating of the movie.
//          * Country where the movie was produced.
//          * Language of the movie.
//          * Plot of the movie.
//          * Actors in the movie.
//          * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
//          * OMDB API requires an API key. You may use `trilogy`.
//
//  * `node liri.js do-what-it-says`
//      Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//          * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//          * Edit the text in random.txt to test out the feature for movie-this and concert-this.

const fs = require('fs');