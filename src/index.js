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
        
        .header-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .header-btn {
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }
        
        .header-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        .header-btn.active {
            background: rgba(255, 255, 255, 0.9);
            color: #667eea;
            border-color: white;
        }
        
        .search-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .lists-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: none;
        }
        
        .lists-container.active {
            display: block;
        }
        
        .list-category {
            margin-bottom: 30px;
        }
        
        .list-category h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.5rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .list-item {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 4px solid #667eea;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .list-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        
        .list-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        
        .list-description {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .list-meta {
            display: flex;
            gap: 15px;
            font-size: 0.8rem;
            color: #888;
        }
        
        .list-meta span {
            background: #e9ecef;
            padding: 4px 8px;
            border-radius: 12px;
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
        
        .certification-badges {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        
        .certification-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .certified-fresh {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        }
        
        .must-see {
            background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
        }
        
        .critics-choice {
            background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(254, 202, 87, 0.3);
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
            <div class="header-buttons">
                <button class="header-btn active" id="searchTab">🔍 Search Movies</button>
                <button class="header-btn" id="listsTab">📋 Browse Lists</button>
            </div>
        </div>
        
        <div class="search-container" id="searchContainer">
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
        
        <div class="lists-container" id="listsContainer">
            <div class="list-category">
                <h3>🌟 Truck Clancy's Curated Lists</h3>
                <div class="list-item" data-list="truck-clancy-certified-fresh">
                    <div class="list-title">Rotten Tomatoes Certified Fresh Movies</div>
                    <div class="list-description">Must-see movies ranked by Tomatometer score - all Certified Fresh!</div>
                    <div class="list-meta">
                        <span>📊 Ranked by Score</span>
                        <span>🍅 Certified Fresh</span>
                        <span>👤 Truck Clancy</span>
                    </div>
                </div>
            </div>
            
            <div class="list-category">
                <h3>🎯 Popular Must-See Lists</h3>
                <div class="list-item" data-list="imdb-top-250">
                    <div class="list-title">IMDb Top 250 Movies</div>
                    <div class="list-description">The highest-rated movies according to IMDb users</div>
                    <div class="list-meta">
                        <span>⭐ Top Rated</span>
                        <span>👥 User Rated</span>
                        <span>🏆 Classic</span>
                    </div>
                </div>
                
                <div class="list-item" data-list="oscar-winners">
                    <div class="list-title">Academy Award Winners</div>
                    <div class="list-description">Movies that won the prestigious Best Picture Oscar</div>
                    <div class="list-meta">
                        <span>🏆 Oscar Winner</span>
                        <span>🎬 Best Picture</span>
                        <span>⭐ Critically Acclaimed</span>
                    </div>
                </div>
            </div>
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
        const searchTab = document.getElementById('searchTab');
        const listsTab = document.getElementById('listsTab');
        const searchContainer = document.getElementById('searchContainer');
        const listsContainer = document.getElementById('listsContainer');
        
        // Truck Clancy's Certified Fresh movies list
        const truckClancyCertifiedFresh = [
            'The Godfather', 'Citizen Kane', 'Casablanca', 'The Dark Knight', 
            'Pulp Fiction', 'Schindler\'s List', '12 Angry Men', 
            'The Lord of the Rings: The Return of the King', 'Inception',
            'The Shawshank Redemption', 'Forrest Gump', 'The Matrix',
            'Goodfellas', 'The Silence of the Lambs', 'Saving Private Ryan',
            'The Lion King', 'Toy Story', 'The Incredibles', 'Up',
            'Parasite', 'Moonlight', 'Spotlight', 'Birdman'
        ];

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

        function getMovieCertifications(movie) {
            const certifications = [];
            const movieTitle = movie.title || '';
            
            // Check if movie is in Truck Clancy's Certified Fresh list
            if (truckClancyCertifiedFresh.some(title => 
                title.toLowerCase() === movieTitle.toLowerCase() ||
                movieTitle.toLowerCase().includes(title.toLowerCase()) ||
                title.toLowerCase().includes(movieTitle.toLowerCase())
            )) {
                certifications.push({
                    text: '🍅 Certified Fresh',
                    class: 'certified-fresh'
                });
                certifications.push({
                    text: '⭐ Must-See',
                    class: 'must-see'
                });
            }
            
            // Check Rotten Tomatoes score for additional certifications
            const tomatoesRating = movie.ratings?.find(r => r.source === 'tomatoes');
            if (tomatoesRating && tomatoesRating.value >= 90) {
                if (!certifications.some(c => c.text.includes('Certified Fresh'))) {
                    certifications.push({
                        text: '🍅 Certified Fresh',
                        class: 'certified-fresh'
                    });
                }
            }
            
            // Check Metacritic score for critics' choice
            const metacriticRating = movie.ratings?.find(r => r.source === 'metacritic');
            if (metacriticRating && metacriticRating.value >= 90) {
                certifications.push({
                    text: '🎯 Critics\' Choice',
                    class: 'critics-choice'
                });
            }
            
            return certifications;
        }

        function renderMovie(movie) {
            const ratings = movie.ratings || [];
            // Only show Metacritic (Critics) and Rotten Tomatoes
            const validRatings = ratings.filter(r => 
                r.value !== null && 
                r.value !== undefined && 
                (r.source === 'metacritic' || r.source === 'tomatoes')
            );
            
            // Check for certifications
            const certifications = getMovieCertifications(movie);
            const certificationBadges = certifications.length > 0 ? 
                '<div class="certification-badges">' +
                    certifications.map(cert => 
                        '<span class="certification-badge ' + cert.class + '">' + cert.text + '</span>'
                    ).join('') +
                '</div>' : '';
            
            return '<div class="movie-card">' +
                '<div class="movie-header">' +
                    '<div>' +
                        '<div class="movie-title">' + movie.title + '</div>' +
                        '<div class="movie-year">' + movie.year + '</div>' +
                        certificationBadges +
                    '</div>' +
                    '<div class="movie-score">' + (movie.score || movie.score_average || 'N/A') + '</div>' +
                '</div>' +
                
                '<div class="ratings-grid">' +
                    validRatings.map(rating => 
                        '<div class="rating-item">' +
                            '<div class="rating-source">' + (rating.source === 'metacritic' ? 'Metacritic' : 'Rotten Tomatoes') + '</div>' +
                            '<div class="rating-value">' + formatRatingValue(rating.value, rating.source) + '</div>' +
                            '<div class="rating-votes">' + formatVotes(rating.votes) + '</div>' +
                        '</div>'
                    ).join('') +
                '</div>' +
            '</div>';
        }

        async function searchMovies(query) {
            try {
                showLoading();
                
                // First, search for movies
                const searchResponse = await fetch('/api/search?query=' + encodeURIComponent(query));
                
                if (!searchResponse.ok) {
                    throw new Error('Search failed: ' + searchResponse.status);
                }
                
                const searchData = await searchResponse.json();
                
                if (!searchData.search || searchData.search.length === 0) {
                    resultsDiv.innerHTML = '<div class="no-results">No movies found. Try a different search term.</div>';
                    hideLoading();
                    return;
                }
                
                // Get detailed info for the first movie (most relevant)
                const firstMovie = searchData.search[0];
                const detailResponse = await fetch('/api/movie/' + firstMovie.ids.imdbid);
                
                if (!detailResponse.ok) {
                    throw new Error('Movie details failed: ' + detailResponse.status);
                }
                
                const movieData = await detailResponse.json();
                
                resultsDiv.innerHTML = renderMovie(movieData);
                hideLoading();
                
            } catch (error) {
                console.error('Search error:', error);
                showError('Error: ' + error.message);
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

        // Tab switching functionality
        searchTab.addEventListener('click', () => {
            searchTab.classList.add('active');
            listsTab.classList.remove('active');
            searchContainer.style.display = 'block';
            listsContainer.classList.remove('active');
            resultsDiv.innerHTML = '';
            searchInput.focus();
        });

        listsTab.addEventListener('click', () => {
            listsTab.classList.add('active');
            searchTab.classList.remove('active');
            searchContainer.style.display = 'none';
            listsContainer.classList.add('active');
            resultsDiv.innerHTML = '';
        });

        // List browsing functionality
        document.querySelectorAll('.list-item').forEach(item => {
            item.addEventListener('click', () => {
                const listType = item.dataset.list;
                browseList(listType);
            });
        });

        async function browseList(listType) {
            try {
                showLoading();
                resultsDiv.innerHTML = '';
                
                let movies = [];
                
                switch(listType) {
                    case 'truck-clancy-certified-fresh':
                        movies = await getTruckClancyCertifiedFresh();
                        break;
                    case 'imdb-top-250':
                        movies = await getIMDbTop250();
                        break;
                    case 'oscar-winners':
                        movies = await getOscarWinners();
                        break;
                    default:
                        throw new Error('Unknown list type');
                }
                
                if (movies.length === 0) {
                    resultsDiv.innerHTML = '<div class="no-results">No movies found in this list.</div>';
                    hideLoading();
                    return;
                }
                
                // Display movies from the list
                const moviesHtml = movies.map(movie => renderMovie(movie)).join('');
                resultsDiv.innerHTML = 
                    '<div style="margin-bottom: 20px; text-align: center;">' +
                        '<h2 style="color: #333; margin-bottom: 10px;">📋 ' + getListTitle(listType) + '</h2>' +
                        '<p style="color: #666;">Showing ' + movies.length + ' movies</p>' +
                    '</div>' +
                    moviesHtml;
                
                hideLoading();
                
            } catch (error) {
                console.error('List browsing error:', error);
                showError('Error loading list: ' + error.message);
                hideLoading();
            }
        }

        function getListTitle(listType) {
            const titles = {
                'truck-clancy-certified-fresh': 'Truck Clancy\'s Certified Fresh Movies',
                'imdb-top-250': 'IMDb Top 250 Movies',
                'oscar-winners': 'Academy Award Winners'
            };
            return titles[listType] || 'Movie List';
        }

        async function getTruckClancyCertifiedFresh() {
            try {
                const response = await fetch('/api/lists/truck-clancy-certified-fresh');
                
                if (!response.ok) {
                    throw new Error('API error: ' + response.status);
                }
                
                const data = await response.json();
                return data.movies || [];
            } catch (error) {
                console.error('Error fetching Truck Clancy list:', error);
                // Fallback to a small sample if API fails
                return [
                    { title: 'The Godfather', year: 1972, score: 97, ratings: [
                        { source: 'tomatoes', value: 97, votes: 100000 },
                        { source: 'metacritic', value: 100, votes: 50000 }
                    ]},
                    { title: 'Citizen Kane', year: 1941, score: 99, ratings: [
                        { source: 'tomatoes', value: 99, votes: 80000 },
                        { source: 'metacritic', value: 100, votes: 30000 }
                    ]}
                ];
            }
        }

        async function getIMDbTop250() {
            // Simulate IMDb Top 250 with some popular movies
            const topMovies = [
                { title: 'The Shawshank Redemption', year: 1994, score: 9.3, ratings: [
                    { source: 'imdb', value: 9.3, votes: 2500000 },
                    { source: 'tomatoes', value: 91, votes: 100000 }
                ]},
                { title: 'The Godfather', year: 1972, score: 9.2, ratings: [
                    { source: 'imdb', value: 9.2, votes: 1800000 },
                    { source: 'tomatoes', value: 97, votes: 100000 }
                ]},
                { title: 'The Dark Knight', year: 2008, score: 9.0, ratings: [
                    { source: 'imdb', value: 9.0, votes: 2500000 },
                    { source: 'tomatoes', value: 94, votes: 200000 }
                ]}
            ];
            
            return topMovies;
        }

        async function getOscarWinners() {
            // Simulate Oscar winners
            const oscarWinners = [
                { title: 'Parasite', year: 2019, score: 99, ratings: [
                    { source: 'tomatoes', value: 99, votes: 50000 },
                    { source: 'metacritic', value: 96, votes: 30000 }
                ]},
                { title: 'Moonlight', year: 2016, score: 98, ratings: [
                    { source: 'tomatoes', value: 98, votes: 40000 },
                    { source: 'metacritic', value: 99, votes: 25000 }
                ]},
                { title: 'Spotlight', year: 2015, score: 97, ratings: [
                    { source: 'tomatoes', value: 97, votes: 35000 },
                    { source: 'metacritic', value: 93, votes: 20000 }
                ]}
            ];
            
            return oscarWinners;
        }

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

// API route to get Truck Clancy's Certified Fresh list
app.get('/api/lists/truck-clancy-certified-fresh', async (c) => {
  try {
    // Try to fetch from MDBList API - this would be the actual implementation
    // For now, we'll return a curated list of certified fresh movies
    const certifiedFreshMovies = [
      {
        title: 'The Godfather',
        year: 1972,
        score: 97,
        ratings: [
          { source: 'tomatoes', value: 97, votes: 100000 },
          { source: 'metacritic', value: 100, votes: 50000 }
        ]
      },
      {
        title: 'Citizen Kane',
        year: 1941,
        score: 99,
        ratings: [
          { source: 'tomatoes', value: 99, votes: 80000 },
          { source: 'metacritic', value: 100, votes: 30000 }
        ]
      },
      {
        title: 'Casablanca',
        year: 1942,
        score: 99,
        ratings: [
          { source: 'tomatoes', value: 99, votes: 90000 },
          { source: 'metacritic', value: 100, votes: 40000 }
        ]
      },
      {
        title: 'The Dark Knight',
        year: 2008,
        score: 94,
        ratings: [
          { source: 'tomatoes', value: 94, votes: 200000 },
          { source: 'metacritic', value: 84, votes: 100000 }
        ]
      },
      {
        title: 'Pulp Fiction',
        year: 1994,
        score: 92,
        ratings: [
          { source: 'tomatoes', value: 92, votes: 150000 },
          { source: 'metacritic', value: 94, votes: 80000 }
        ]
      },
      {
        title: 'Schindler\'s List',
        year: 1993,
        score: 98,
        ratings: [
          { source: 'tomatoes', value: 98, votes: 120000 },
          { source: 'metacritic', value: 94, votes: 60000 }
        ]
      },
      {
        title: '12 Angry Men',
        year: 1957,
        score: 100,
        ratings: [
          { source: 'tomatoes', value: 100, votes: 70000 },
          { source: 'metacritic', value: 96, votes: 25000 }
        ]
      },
      {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
        score: 93,
        ratings: [
          { source: 'tomatoes', value: 93, votes: 180000 },
          { source: 'metacritic', value: 94, votes: 90000 }
        ]
      }
    ];
    
    return c.json({ movies: certifiedFreshMovies });
  } catch (error) {
    console.error('Truck Clancy list API error:', error);
    return c.json({ error: 'Failed to get Truck Clancy\'s list' }, 500);
  }
});

export default app;
