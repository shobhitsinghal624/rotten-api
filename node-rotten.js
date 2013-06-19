var request = require('request'),

    util = require('util'),
    API = require('./API'),

    /**
     * Returns the specified data as a JSON object,
     * or an object with a single 'error' property if 
     * the parsing fails.
     * 
     * @param data the data to parse as JSON
     */
    toJSON = function(data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return {
                "error": "Error parsing the response !"
            };
        }
    },

    // true if the provided id is valid, false otherwise
    isId = (function () {
        var regex = /^[0-9]+$/;
        return (function (id) { return regex.test(id); });
    })(),
    
    // true if the provided IMDB id is valid, false otherwise
    isImdbId = (function () {
        var regex = /^(tt)?[0-9]+$/;
        return (function (id) { return regex.test(id); });
    })(),
    
    // Invoke the callback with given error or throw it
    cbOrThrow = function (cb, err) {
        if (typeof cb === 'function') {
            cb(err, null); 
        } else {
            throw err;
        }
    },
    
    // returns the specified id if valid, undefined otherwise
    checkId = function (id) {
        return (typeof id === 'string' && isId(id)) ? id : undefined; 
    },
    
    /**
     * Handles the actual HTTP GET request at the specified url 
     * with the given parameters. 
     * 
     * Calls the optionnal callback upon completion.
     * 
     * @param url {String} the url where to make the request to
     * @param params {Object} the request parameters
     * @param cb [optional] {Function} the callback
     */
    _get = function(url, params, cb) {
        
        request.get({
            "uri": url,
            "qs": params
        }, function(url, res, data) {

            var err = null;
            data = toJSON(data);

            if (res.statusCode !== 200) {
                err = new Error("Status code : " + res.statusCode);
            } else if (data && data.error) {
                err = new Error(data.error);
            }

            if (typeof cb === 'function') {
                cb(err, data);
            }
        });
    },
    
    /**
     * Handles the client request for the named API.
     * 
     * @param name {String} the API service
     * @param opt {Object} the request options
     * @param cb [optional] {Function} the callback
     */
    _handle = function (name, opt, cb) {
        
        var api = API[name],
            url = api.url,
            params = api.params ? api.params() : {};
        
        // Require a callback to exists.
        if (typeof cb !== 'function') {
            throw new Error("Callback is required !");
        }
        
        // Format url if needed
        if (api.format && opt[api.format]) {
            url = util.format.call(null, url, opt[api.format]);
        }
        
        // Get client parameters
        opt = opt || {};
        for (var p in params) {
            if (p in opt) {
                params[p] = opt[p];
            }
        }
        params.apikey = this.key;
        
        _get(url, params, cb);
    };

/**
 * Constructs a Rotten object with the given options.
 * 
 * If opt is a String it is considered as the API key.
 * If it is an object, the following properties apply :
 * 
 *  - 'key' : the Rotten Tomatoes API key
 *  - 'limit' : the default result limit per page when applicable 
 */
function Rotten(opt) {

    if (typeof opt === 'string') { 
        opt = {"key": opt}; 
    }

    opt = opt || {};
    
    this.key = opt.key;
    this.limit = opt.limit || API.LIMIT;

    if (typeof this.key !== 'string') {
        throw new Error("Invalid API key");
    }
}

/**
 * Retrieves Top Box Office Earning Movies.
 * Sorted by Most Recent Weekend Gross Ticket Sales.
 * 
 * If a single parameter is given, then it should
 * be the callback. The result limit and country will defaults
 * to respectively 10 and 'us'.'
 * 
 * @param opt {Object|String|int|function}
 *  - a string to specify the country as (ISO 3166-1 alpha-2)
 *  - a number to specify the limit
 *  - an object with both properties 'limit' and 'country'
 * 
 * @param cb {function} the callback
 */
Rotten.prototype.boxOffice = function(opt, cb) {
    
    if (arguments.length === 1) { 
        cb = opt;
        opt = null;
    } else {
        if (typeof opt === 'string') { 
            opt = {"country": opt};
        } else if (typeof opt === 'number') {
            opt = {"limit": opt};
        } 
    }
    
    _handle.call(this, "boxOffice", opt, cb);
};

/**
 * Retrieves movies currently in theaters. A 'page' 
 * property can be specified if the first parameter is an object.
 *
 * The same parameters as the Rotten#boxOffice method apply.
 */
Rotten.prototype.inTheaters = function(opt, cb) {
    
    if (arguments.length === 1) { 
        cb = opt;
        opt = null;
    } else {
        if (typeof opt === 'string') {
            opt = {"country": opt};
        } else if (typeof opt === 'number') {
            opt = {"page_limit": opt};
        } else {
            opt.page_limit = opt ? (opt.limit || opt.page_limit || this.limit) : this.limit;
        }
    }
    
    _handle.call(this, "inTheaters", null, cb);
};

/**
 * Retrieves current opening movies
 *
 * The same parameters as the Rotten#boxOffice method apply.
 */
Rotten.prototype.opening = function(opt, cb) {
    
    if (arguments.length === 1) { 
        cb = opt;
        opt = null;
    } else {
        if (typeof opt === 'string') { 
            opt = {"country": opt};
        } else if (typeof opt === 'number') {
            opt = {"limit": opt};
        } 
    }
    
    _handle.call(this, "opening", null, cb);
};

/**
 * Retrieves upcoming movies.
 *
 * The same parameters as the Rotten#boxOffice method apply. A 'page' 
 * property can be specified if the first parameter is an object.
 */
Rotten.prototype.upcoming = function(opt, cb) {
    
    if (arguments.length === 1) { 
        cb = opt;
        opt = null;
    } else {
        if (typeof opt === 'string') { 
            opt = {"country": opt};
        } else if (typeof opt === 'number') {
            opt = {"limit": opt};
        } 
    }
    _handle.call(this, "upcoming", null, cb);
};

/**
 * Retrieves detailed information on a movie specified by its id.
 * 
 * @param id {String} the movie's id
 * @param cb {function) the callback
 */
Rotten.prototype.get = 
Rotten.prototype.info = function(id, cb) {
    id = checkId(id);
    if (!id) {
        return cbOrThrow(cb, new Error("Invalid id."));
    }
    _handle.call(this, "info", {"id": id}, cb);
};

/**
 * Retrieves the full casting of the movie specified by its id.
 * 
 * @param id {String} the movie's id
 * @param cb {function) the callback
 */
Rotten.prototype.cast = function(id, cb) {
    id = checkId(id);
    if (!id) {
        return cbOrThrow(cb, new Error("Invalid id."));
    }
    _handle.call(this, "cast", {"id": id}, cb);
};

/**
 * Retrieves movie clips related to the movie specified by its id.
 * 
 * @param id {String} the movie's id
 * @param cb {function) the callback
 */
Rotten.prototype.clips = function(id, cb) {
    id = checkId(id);
    if (!id) {
        return cbOrThrow(cb, new Error("Invalid id."));
    }
    _handle.call(this, "clips", {"id": id}, cb);
};

/**
 * Retrieves the reviews for a movie.
 * 
 * @param opt {Object}
 *  - 'review_type' : one of "all", "top_critic" and "dvd"
 *  - 'limit' : number of reviews per page
 *  - 'page' : the page number
 *  - 'country' : for localized data
 * @parama cb {function}
 */
Rotten.prototype.reviews = function(opt, cb) {
    var id = checkId(opt);
    
    opt = opt || {};
    
    opt.id = id || opt.id;
    opt.page_limit = opt.limit || opt.page_limit || this.limit;
    
    if (!opt.id) {
        return cbOrThrow(cb, new Error("Invalid id."));
    }
    
    _handle.call(this, "reviews", opt, cb);
};

/**
 * Shows similar movies for a movie specified by its id. 
 * 
 * @param opt {Object|String}
 *  - a string to specify the movie's id.
 *  - a object with both 'limit' and 'id' properties
 * @parama cb {function}
 */
Rotten.prototype.similar = function(opt, cb) {
    
    var id = checkId(opt);
    
    if (typeof opt ==='string') {
        opt = {"id": id}
    } else {
        opt = opt || {};
        
        opt.id = id || opt.id;
        opt.page_limit = opt.limit || opt.page_limit || this.limit;
    }
    
    if (!opt.id) {
        return cbOrThrow(cb, new Error("Invalid id."));
    }
    
    _handle.call(this, "similar", opt, cb);
};

/**
 * Retrieves detailed information on a movie specified by its IMDB id.
 * 
 * @param id {String} the movie's IMDB id, optionaly starting with 'tt' as IMDB ids do.
 */
Rotten.prototype.imdb =
Rotten.prototype.alias = function(id, cb) {
     
    if (typeof id === 'string' && isImdbId(id)) {
        id = {"id": id.replace("tt", '')}; 
    } else {
        return cbOrThrow(cb, new Error("Invalid IMDB id."));
    }
    
    _handle.call(this, "alias", id, cb);
};

/**
 * Search for a movie based on a query String.
 * 
 * @param opt {String|Object} the search options
 *  - If opt is a String then it is treated as the query String
 *  - If opt is an object then the following properties apply :
 *      q | query : the query string, must be non-empty !
 *      page      : the page number (not the number of page)
 *      limit     : the limit of result per page
 */
Rotten.prototype.search = function(opt, cb) {
    
    if (typeof opt === 'string' || typeof opt === 'number') { 
        opt = {"q": opt + ''}; 
    } else {
        opt = opt || {};
        opt.q = opt.q || opt.query || null;
        opt.page_limit = opt.limit || opt.page_limit || this.limit;
    }
    
    // Don't make the query on an empty string
    if (typeof opt.q !== 'string' || opt.q.trim() === '') {
        return cbOrThrow(cb, new Error("Query must be a non-empty string."));
    }
    
    _handle.call(this, "search", opt, cb);
};

module.exports = function(opt) {
    return new Rotten(opt);
};
