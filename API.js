var LIMIT = 10;

module.exports = {

    "LIMIT": LIMIT,

    "boxOffice": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json",
        "params": function() {
            return {
                "limit": LIMIT,
                "country": "us"
            };
        }
    },
    
    "inTheaters": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json",
        "params": function() {
            return {
                "page": 1,
                "country": "us",
                "page_limit": LIMIT
            };
        }
    },
    
    "opening": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json",
        "params": function() {
            return {
                "limit": LIMIT,
                "country": "us"
            };
        }
    },
    
    "upcoming": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json",
        "params": function() {
            return {
                "limit": LIMIT,
                "country": "us"
            };
        }
    },
    
    "info": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movies/%s.json",
        "format": "id"
    },
    
    "cast": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/cast.json",
        "format": "id"
    },
    
    "clips": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/clips.json",
        "format": "id"
    },
    
    "reviews": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/reviews.json",
        "format": "id",
        "params": function() {
            return {
                "page": 1,
                "country": "us",
                "page_limit": 20,
                "review_type": "all"
            };
        }
    },
    
    "similar": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/similar.json",
        "format": "id",
        "params": function() {
            return {
                "limit": 5
            };
        }
    },
    
    "alias": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json?type=imdb",
        "params": function() {
            return {
                "id": null
            };
        }
    },
    
    "search": {
        "url": "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
        "params": function() {
            return {
                "q": '',
                "page": 1,
                "page_limit": 30
            };
        }
    }
};