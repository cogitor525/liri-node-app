// read and set any environment variables with the dotenv package
require("dotenv").config();

// import the `keys.js` file
const keys = require("./keys.js");

const axios = require('axios');

let command = process.argv[2];
// the 'query' (4th CL argument) needs to be in quotes (" ") for multi-word entries
let query = process.argv[3];

function runCommand() {
    switch(command) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
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
    const moment = require('moment');

    function Event(venue, location, date) {
        this.venue = venue;
        this.location = location;
        this.date = date;
    }

    axios.get(url)
        .then(function(response) {
            const data = response.data;
            const events = data.map(function(currentValue) {
                const venue = currentValue.venue.name;
                const location = currentValue.venue.city + ", " + currentValue.venue.country;
                const date = moment(currentValue.datetime).format("L");
                return new Event(venue, location, date); 
            });
            const header = "*** Upcoming concerts for " + query + " ***";
            displayInfo(events, header);
        })
        .catch(function(error) {
            console.log(error);
        })
        .finally(function() {
            console.log("finally code here");
        });
}

function displayInfo(info, header) {
    const divider = "-------------------------------------------";    

    // this section runs if info is an array of objects (as occurs for concert events)
    if (info.length) {
        console.log(header);
        console.log(divider);
        info.forEach(function(currentValue, index) {
            console.log("\t== Event " + ++index + " ==");
            displayObject(currentValue);
        });
    // otherwise, info is a single object (as for a song or movie)
    } else {
        displayObject(info);
    }

    function displayObject(obj) {
        for (let [key, value] of Object.entries(obj)) {
            console.log(`${key}: ${value}`);
        }
        console.log(divider);
    }
}

//  * `node liri.js spotify-this-song '<song name here>'`
//      This will show the following information about the song in your terminal/bash window
//          * Artist(s)
//          * The song's name
//          * A preview link of the song from Spotify
//          * The album that the song is from
//          * If no song is provided then your program will default to "The Sign" by Ace of Base.

function spotifyThis() {
    if (!query) {
        query = "The Sign";
    }
    const Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);

    function Song(artist, song, link, album) {
        this.artist = artist;
        this.song = song;
        this.preview_link = link;
        this.album = album;
    }

    spotify.search({ type: 'track', query: query })
        .then(function(response) {
            const items = response.tracks.items;
            // to sift out first exact match to query
            const index = items.findIndex(function(item) {
                return item.name.toUpperCase() == query.toUpperCase();
            });
            const track = items[index];

            const artist = track.artists[0].name;
            const title = track.name;
            const link = track.preview_url;
            const album = track.album.name;

            const song = new Song(artist,title,link,album);
            displayInfo(song);
        })
        .catch(function(err) {
            console.log(err);
        });
}

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

function movieThis() {
    if (!query) {
        query = "Mr. Nobody";
    }
    const url = "http://www.omdbapi.com/?apikey=trilogy&t=" + query;

    function Movie(title, year, imdbRating, tomatoRating, country, lang, plot, actors) {
        this.title = title;
        this.year = year;
        this.IMDB_rating = imdbRating;
        this.Rotten_Tomatoes_rating = tomatoRating;
        this.country = country;
        this.language = lang;
        this.plot = plot;
        this.actors = actors;
    }

    axios.get(url)
        .then(function(response) {
            const data = response.data;
            const title = data.Title;
            const year = data.Year;
            const imdbRating = data.imdbRating;

            // find index for Rotten Tomatoes rating within "Ratings" array
            const indexTR = data.Ratings.findIndex(function(item) {
                return item.Source == "Rotten Tomatoes";
            });
            const tomatoRating = data.Ratings[indexTR].Value;

            const country = data.Country;
            const lang = data.Language;
            const plot = data.Plot;
            const actors = data.Actors;

            const movie = new Movie(title, year, imdbRating, tomatoRating, country, lang, plot, actors);
            displayInfo(movie);
        })
        .catch(function(error) {
            console.log(error);
        })
        .finally(function() {
            console.log("finally code here");
        });
}

//  * `node liri.js do-what-it-says`
//      Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//          * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//          * Edit the text in random.txt to test out the feature for movie-this and concert-this.

const fs = require('fs');