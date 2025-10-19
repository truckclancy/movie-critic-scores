import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors());

// Serve the main HTML page
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Critic Scores</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .search-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .search-form {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .search-input {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .search-btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .search-btn:hover {
            transform: translateY(-2px);
        }
        
        .search-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .loading {
            text-align: center;
            color: #666;
            font-style: italic;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #c33;
        }
        
        .results {
            display: grid;
            gap: 20px;
        }
        
        .movie-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .movie-card:hover {
            transform: translateY(-5px);
        }
        
        .movie-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .movie-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
        }
        
        .movie-year {
            color: #666;
            font-size: 1.1rem;
        }
        
        .movie-score {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .ratings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .rating-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            border-left: 4px solid #667eea;
        }
        
        .rating-source {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            text-transform: capitalize;
        }
        
        .rating-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .rating-votes {
            color: #666;
            font-size: 0.9rem;
        }
        
        .no-results {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 40px;
        }
        
        @media (max-width: 768px) {
            .search-form {
                flex-direction: column;
            }
            
            .movie-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .movie-score {
                margin-top: 10px;
            }
            
            .ratings-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎬 Movie Critic Scores</h1>
            <p>Search any movie to see scores from Rotten Tomatoes and Metacritic!</p>
        </div>
        
        <div class="search-container">
            <form class="search-form" id="searchForm">
                <input 
                    type="text" 
                    class="search-input" 
                    id="searchInput" 
                    placeholder="Enter movie name (e.g., The Godfather, Inception, Pulp Fiction)"
                    required
                >
                <button type="submit" class="search-btn" id="searchBtn">
                    🔍 Search
                </button>
            </form>
            <div id="error" class="error" style="display: none;"></div>
            <div id="loading" class="loading" style="display: none;">Searching for movies...</div>
        </div>
        
        <div id="results" class="results"></div>
    </div>

    <script>
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const errorDiv = document.getElementById('error');
        const loadingDiv = document.getElementById('loading');
        const resultsDiv = document.getElementById('results');

        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            loadingDiv.style.display = 'none';
        }

        function hideError() {
            errorDiv.style.display = 'none';
        }

        function showLoading() {
            loadingDiv.style.display = 'block';
            hideError();
            resultsDiv.innerHTML = '';
        }

        function hideLoading() {
            loadingDiv.style.display = 'none';
        }

        function formatRatingValue(value, source) {
            if (value === null || value === undefined) return 'N/A';
            
            if (source === 'letterboxd') {
                return value + '/5';
            } else if (source === 'imdb' || source === 'metacriticuser') {
                return value + '/10';
            } else if (source === 'rogerebert') {
                return value + '/4';
            } else if (source === 'metacritic') {
                return value + '/100';
            } else if (source === 'tomatoes' || source === 'popcorn' || source === 'trakt' || source === 'tmdb') {
                return value + '%';
            }
            return value;
        }

        function formatVotes(votes) {
            if (!votes) return '';
            if (votes >= 1000000) {
                return (votes / 1000000).toFixed(1) + 'M votes';
            } else if (votes >= 1000) {
                return (votes / 1000).toFixed(1) + 'K votes';
            }
            return votes + ' votes';
        }

        function renderMovie(movie) {
            const ratings = movie.ratings || [];
            // Only show Metacritic and Rotten Tomatoes
            const validRatings = ratings.filter(r => 
                r.value !== null && 
                r.value !== undefined && 
                (r.source === 'metacritic' || r.source === 'tomatoes' || r.source === 'metacriticuser')
            );
            
            return \`
                <div class="movie-card">
                    <div class="movie-header">
                        <div>
                            <div class="movie-title">\${movie.title}</div>
                            <div class="movie-year">\${movie.year}</div>
                        </div>
                        <div class="movie-score">\${movie.score || movie.score_average || 'N/A'}</div>
                    </div>
                    
                    <div class="ratings-grid">
                        \${validRatings.map(rating => \`
                            <div class="rating-item">
                                <div class="rating-source">\${rating.source === 'metacritic' ? 'Metacritic (Critics)' : 
                                                           rating.source === 'metacriticuser' ? 'Metacritic (Users)' : 
                                                           'Rotten Tomatoes'}</div>
                                <div class="rating-value">\${formatRatingValue(rating.value, rating.source)}</div>
                                <div class="rating-votes">\${formatVotes(rating.votes)}</div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;
        }

        async function searchMovies(query) {
            try {
                showLoading();
                
                // First, search for movies
                const searchResponse = await fetch(\`/api/search?query=\${encodeURIComponent(query)}\`);
                
                if (!searchResponse.ok) {
                    throw new Error(\`Search failed: \${searchResponse.status}\`);
                }
                
                const searchData = await searchResponse.json();
                
                if (!searchData.search || searchData.search.length === 0) {
                    resultsDiv.innerHTML = '<div class="no-results">No movies found. Try a different search term.</div>';
                    hideLoading();
                    return;
                }
                
                // Get detailed info for the first movie (most relevant)
                const firstMovie = searchData.search[0];
                const detailResponse = await fetch(\`/api/movie/\${firstMovie.ids.imdbid}\`);
                
                if (!detailResponse.ok) {
                    throw new Error(\`Movie details failed: \${detailResponse.status}\`);
                }
                
                const movieData = await detailResponse.json();
                
                resultsDiv.innerHTML = renderMovie(movieData);
                hideLoading();
                
            } catch (error) {
                console.error('Search error:', error);
                showError(\`Error: \${error.message}\`);
                hideLoading();
            }
        }

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (!query) {
                showError('Please enter a movie name to search.');
                return;
            }
            
            searchMovies(query);
        });

        // Focus search input on page load
        searchInput.focus();
    </script>
</body>
</html>
  `);
});

// API route to search movies
app.get('/api/search', async (c) => {
  const query = c.req.query('query');
  
  if (!query) {
    return c.json({ error: 'Query parameter is required' }, 400);
  }

  try {
    const response = await fetch(`https://api.mdblist.com/search/movie?apikey=c1hvz5jrzj950iepb759nuyss&query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`MDBList API error: ${response.status}`);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return c.json({ error: 'Failed to search movies' }, 500);
  }
});

// API route to get movie details
app.get('/api/movie/:imdbId', async (c) => {
  const imdbId = c.req.param('imdbId');
  
  if (!imdbId) {
    return c.json({ error: 'IMDb ID is required' }, 400);
  }

  try {
    const response = await fetch(`https://api.mdblist.com/imdb/movie/${imdbId}?apikey=c1hvz5jrzj950iepb759nuyss`);
    
    if (!response.ok) {
      throw new Error(`MDBList API error: ${response.status}`);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Movie API error:', error);
    return c.json({ error: 'Failed to get movie details' }, 500);
  }
});

export default app;
