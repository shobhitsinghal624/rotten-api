var r = require('./rotten')("YOUR_API_KEY");

r.search('The Godfather', function (err, res) {
    if (!err) {
        var movies = (res && res.movies) ? res.movies : [];
        for(var i = 0, len = movies.length; i < len; i++) {
            console.log(movies[i].id + " : " + movies[i].title);
        }
    }
});

r.search({
    "query": 'The Godfather',
    "limit": 3
}, function (err, res) {
    if (!err) {
        var movies = (res && res.movies) ? res.movies : [];
        for(var i = 0, len = movies.length; i < len; i++) {
            console.log(movies[i].id + " : " + movies[i].title);
        }
    }
});

r.get("12911", function (err, res) {
    if (!err) {
        var movie = res || {};
        console.log(movie);
    }
});

r.alias("tt0068646", function (err, res) {
    if (!err) {
        var movie = res || {};
        console.log(movie);
    }
});

r.similar("12911", function (err, res) {
    if (!err) {
        var movies = (res && res.movies) ? res.movies : [];
        for(var i = 0, len = movies.length; i < len; i++) {
            console.log(movies[i].id + " : " + movies[i].title);
        }
    }
});
