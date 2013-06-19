# node-rotten

node-rotten is a simple to use NodeJS interface to the [Rotten Tomatoes API](http://developer.rottentomatoes.com/).

You can 
    - search for movies based on a query string
    - get information on a single movie with its id (or IMDB id)
    - get similar movies of a given movie id
    - get the full cast of a movie
    - ...
    
Every callback takes two arguments, an `error` object and a `response` object.
In the examples below the errors are not handled, this is not recommended.

Oh, and one more thing, this module is certified fresh !

## Install

Coming soon...

## Getting Started

See the Rotten Tomatoes API [web site](http://developer.rottentomatoes.com/) to get your API key.
```js
var r = require('node-rotten')("YOU_API_KEY");
```

### Searching for movies

Supply a query string to the `search` method.
```js
r.search('The Godfather', function (err, res) {
    if (!err) {
        var movies = (res && res.movies) ? res.movies : [];
        for(var i = 0, len = movies.length; i < len; i++) {
            console.log(movies[i].id + " : " + movies[i].title);
        }
    }
});
```
outputs :
```bash
12911 : The Godfather
12926 : The Godfather, Part II
13476 : The Godfather, Part III
770669374 : Bonanno: A Godfather's Story (The Youngest Godfather)
405587791 : Godfather
# 25 more lines ...
```

If you wish to see less results :
```js
r.search({
    "query": 'The Godfather'
    "limit": 3
}, function (err, res) {
        // same as above
});
```
will output :
```bash
12911 : The Godfather
12926 : The Godfather, Part II
13476 : The Godfather, Part III
```

### Get information on a single movie.

By supplying the movie's id (possibly retrieved thanks to a search query.

```js
r.get("12911", function (err, res) {
    if (!err) {
        var movie = res || {};
        console.log(movie);
    }
});
```
or by supplying the IMDB id :
```js
r.alias("tt0068646", function (err, res) {
        // same as above
});
```
outputs in both cases :
```js
{ id: 12911,
  title: 'The Godfather',
  year: 1972,
  genres: [ 'Drama' ],
  mpaa_rating: 'R',
  runtime: 175,
  critics_consensus: 'One of Hollywood\'s greatest critical and commercial successes, The Godfather gets everything right; not only did the movie transcend expectations, it established new benchmarks for American cinema.',
  release_dates: { theater: '1972-03-24', dvd: '2001-10-09' },
  ratings:
   { critics_rating: 'Certified Fresh',
     critics_score: 100,
     audience_rating: 'Upright',
     audience_score: 97 },
  synopsis: '',
  posters:
   { thumbnail: 'http://content6.flixster.com/movie/11/17/16/11171612_mob.jpg',
     profile: 'http://content6.flixster.com/movie/11/17/16/11171612_pro.jpg',
     detailed: 'http://content6.flixster.com/movie/11/17/16/11171612_det.jpg',
     original: 'http://content6.flixster.com/movie/11/17/16/11171612_ori.jpg' },
  abridged_cast:
   [ { name: 'Marlon Brando', id: '162660428', characters: [Object] },
     { name: 'Al Pacino', id: '162654461', characters: [Object] },
     { name: 'James Caan', id: '162656402', characters: [Object] },
     { name: 'John Cazale', id: '162664256', characters: [Object] },
     { name: 'Robert Duvall', id: '162652186', characters: [Object] } ],
  abridged_directors: [ { name: 'Francis Ford Coppola' } ],
  studio: 'Paramount Pictures',
  alternate_ids: { imdb: '0068646' },
  links:
   { self: 'http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json?type=imdb&id=0068646',
     alternate: 'http://www.rottentomatoes.com/m/godfather/',
     cast: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/cast.json',
     clips: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/clips.json',
     reviews: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/reviews.json',
     similar: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/similar.json',
     canonical: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911.json' },
  link_template: 'http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json?type=imdb&id={alias-id}' }
```
### Formats

### Single result format

```js
{ id: 12911,
  title: 'The Godfather',
  year: 1972,
  genres: [ 'Drama' ],
  mpaa_rating: 'R',
  runtime: 175,
  critics_consensus: 'One of Hollywood\'s greatest critical and commercial successes, The Godfather gets everything right; not only did the movie transcend expectations, it established new benchmarks for American cinema.',
  release_dates: { theater: '1972-03-24', dvd: '2001-10-09' },
  ratings:
   { critics_rating: 'Certified Fresh',
     critics_score: 100,
     audience_rating: 'Upright',
     audience_score: 97 },
  synopsis: '',
  posters:
   { thumbnail: 'http://content6.flixster.com/movie/11/17/16/11171612_mob.jpg',
     profile: 'http://content6.flixster.com/movie/11/17/16/11171612_pro.jpg',
     detailed: 'http://content6.flixster.com/movie/11/17/16/11171612_det.jpg',
     original: 'http://content6.flixster.com/movie/11/17/16/11171612_ori.jpg' },
  abridged_cast:
   [ { name: 'Marlon Brando', id: '162660428', characters: [Object] },
     { name: 'Al Pacino', id: '162654461', characters: [Object] },
     { name: 'James Caan', id: '162656402', characters: [Object] },
     { name: 'John Cazale', id: '162664256', characters: [Object] },
     { name: 'Robert Duvall', id: '162652186', characters: [Object] } ],
  abridged_directors: [ { name: 'Francis Ford Coppola' } ],
  studio: 'Paramount Pictures',
  alternate_ids: { imdb: '0068646' },
  links:
   { self: 'http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json?type=imdb&id=0068646',
     alternate: 'http://www.rottentomatoes.com/m/godfather/',
     cast: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/cast.json',
     clips: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/clips.json',
     reviews: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/reviews.json',
     similar: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911/similar.json',
     canonical: 'http://api.rottentomatoes.com/api/public/v1.0/movies/12911.json' },
  link_template: 'http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json?type=imdb&id={alias-id}' }
```

### Multiple results format
```js
{ total: 49,
  movies:
   [ { id: '12911',
       title: 'The Godfather',
       year: 1972,
       mpaa_rating: 'R',
       runtime: 175,
       critics_consensus: 'One of Hollywood\'s greatest critical and commercial successes, The Godfather gets everything right; not only did the movie transcend expectations, it established new benchmarks for American cinema.',
       release_dates: [Object],
       ratings: [Object],
       synopsis: '',
       posters: [Object],
       abridged_cast: [Object],
       alternate_ids: [Object],
       links: [Object] },
     { id: '12926',
       title: 'The Godfather, Part II',
       year: 1974,
       mpaa_rating: 'R',
       runtime: 200,
       critics_consensus: 'Drawing on strong performances by Al Pacino and Robert De Niro, Francis Ford Coppola\'s continuation of Mario Puzo\'s Mafia saga set new standards for sequels that have yet to be matched or broken.',
       release_dates: [Object],
       ratings: [Object],
       synopsis: '',
       posters: [Object],
       abridged_cast: [Object],
       alternate_ids: [Object],
       links: [Object] },
       // ...
       ],
  links:
   { self: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=The+Godfather&page_limit=30&page=1',
     next: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=The+Godfather&page_limit=30&page=2' },
  link_template: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q={search-term}&page_limit={results-per-page}&page={page-number}' }
```