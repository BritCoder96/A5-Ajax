var http = require('http')
  , fs = require('fs')
  , url = require('url')
  , qs = require('querystring')
  , path = require('path')
  , port = '8080'



var  movies = ['Big Fish', 'Doctor Strange', 'Inception', 'Jaws', 'Jaws 2', 'Jaws 3', 'Space Jam', 'Space James III: Leberon\'s Revenge', 'Space James IV: Return of the James',
                'Space James V: Kobe: A New Hope', 'Space James VI: The Kobe Awakens', 'Star Wars Episode I', 'Star Wars Episode II', 'Star Wars Episode III', 'Star Wars Episode IV',
                'Star Wars Episode V', 'Star Wars Episode VI', 'Star Wars Episode VII', 'Star Wars: Rogue One', 'The Illusionist', 'The Avengers']
var results = movies
var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url);

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'index.html');
      break;
    case '/index.html':
      sendFile(res, 'index.html');
      break;
    case '/searchMovies':
      handleSearch(req, movies)
      res.end( results.toString() )
      break;
    case '/search':
      sendFile(res, 'search.html');
      break;
    case '/movies':
      res.end( movies.toString() )
      break;
    case '/putNewMovie':
      handlePost(req)
      res.end()
      break;
    case '/README.md':
      sendFile(res, 'README.md', 'text/x-markdown');
      break;
    case '/css/style.css':
      sendFile(res, 'css/style.css', 'text/css');
      break;
    case '/js/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript');
      break;
    default:
      res.end('404 not found');
  }
});

function handlePost(req) {
  var body = ''

  req.on('data', function(d) {
    body += d;
  })
  req.on('end', function(d) {
    var post = qs.parse( body )
    if( post.newmovie ) {
      movies.push( post.newmovie )
      movies.sort()
    }
    if ( post.deletemovie ) {
      i = movies.indexOf( post.deletemovie )
      if (i > -1) {
        movies.splice(i, 1)
        movies.sort()
      }
    }
  })

}

function handleSearch(req, movies) {
  var body = ''

  req.on('data', function(d) {
    body += d;
  })
  req.on('end', function(d) {
    var post = qs.parse( body )

    if (post.search) {
      results = []
      for (var movie of movies) {
        if (movie.toLowerCase().indexOf(post.search.toLowerCase()) !== -1) {
          results.push(movie);
        };
      }
      results = results.sort().toString()
    } else {
      results = movies.sort().toString()
    }
  })
}

server.listen(process.env.PORT || port)
console.log('listening on 8080');

// subroutines

function sendFile(res, filename) {
  res.writeHead(200, {'Content-type': 'text/html'})

  var stream = fs.createReadStream(filename)

  stream.on('data', function(data) {
    res.write(data);
  })

  stream.on('end', function(data) {
    res.end();
    return;
  })
}