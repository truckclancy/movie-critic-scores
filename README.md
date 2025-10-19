# 🎬 Movie Critic Scores

A beautiful web app that lets you search for movies and get comprehensive critic scores from multiple sources including Rotten Tomatoes, Metacritic, IMDb, Letterboxd, and more!

## ✨ Features

- **🔍 Movie Search**: Search for any movie by name
- **📊 Comprehensive Scores**: Get ratings from 9+ sources:
  - Rotten Tomatoes (Critics & Audience)
  - Metacritic (Critics & Users)
  - IMDb
  - Letterboxd
  - Roger Ebert
  - TMDb
  - Trakt
  - Popcorn
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Fast & Lightweight**: Built with Cloudflare Workers
- **🎨 Beautiful UI**: Modern, gradient design with smooth animations

## 🚀 Live Demo

[Deploy to Cloudflare Workers](https://workers.cloudflare.com/)

## 🛠️ Tech Stack

- **Backend**: Cloudflare Workers + Hono
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **API**: MDBList API for movie data
- **Deployment**: Cloudflare Workers

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-critic-scores
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Get your MDBList API key from [mdblist.com/preferences/](https://mdblist.com/preferences/)
   - Update the API key in `src/index.js` (replace `c1hvz5jrzj950iepb759nuyss`)

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Deploy to Cloudflare Workers**
   ```bash
   npm run deploy
   ```

## 🔧 Configuration

### Environment Variables

You can set the MDBList API key as an environment variable in Cloudflare Workers:

1. Go to your Cloudflare Workers dashboard
2. Select your worker
3. Go to Settings > Variables
4. Add a new variable:
   - **Variable name**: `MDBLIST_API_KEY`
   - **Value**: Your MDBList API key

Then update the code to use the environment variable:

```javascript
const apiKey = c.env.MDBLIST_API_KEY || 'your-fallback-key';
```

## 📖 API Endpoints

- `GET /` - Main application page
- `GET /api/search?query=movie_name` - Search for movies
- `GET /api/movie/:imdbId` - Get detailed movie information with critic scores

## 🎯 Usage

1. **Search**: Enter a movie name in the search box
2. **Results**: View comprehensive critic scores from multiple sources
3. **Compare**: See how different platforms rate the same movie

## 🔍 Example Searches

Try searching for:
- "The Godfather" (97% Rotten Tomatoes, 100 Metacritic!)
- "Inception" (87% Rotten Tomatoes, 74 Metacritic)
- "Pulp Fiction" (92% Rotten Tomatoes, 94 Metacritic)
- "The Dark Knight" (94% Rotten Tomatoes, 84 Metacritic)

## 🎨 Customization

### Styling
The app uses CSS custom properties for easy theming. You can modify colors in the `<style>` section of `src/index.js`.

### Adding New Rating Sources
The MDBList API supports many rating sources. Check their documentation for the complete list.

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your MDBList API key is valid
3. Ensure you have sufficient API quota remaining

---

**Built with ❤️ using Cloudflare Workers and the MDBList API**
