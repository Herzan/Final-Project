// middleware/githubAuth.js  (lightweight manual OAuth for simplicity)
const axios = require('axios');

const githubOAuth = {
  // Step 1: Redirect to GitHub
  login: (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URI}&scope=user:email`;
    res.redirect(githubAuthUrl);
  },

  // Step 2: Callback
  callback: async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'No code provided' });

    try {
      // Exchange code for token
      const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.CALLBACK_URI
      }, { headers: { Accept: 'application/json' } });

      const accessToken = tokenRes.data.access_token;

      // Get user info
      const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` }
      });

      const githubUser = userRes.data;

      // TODO: Find or create user in MongoDB (link GitHub ID or email)
      // For now, return token (you can integrate with your JWT flow)
      const jwtToken = require('jsonwebtoken').sign(
        { id: githubUser.id, name: githubUser.name || githubUser.login },
        process.env.JWT_SECRET || process.env.SESSION_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'GitHub login successful',
        token: jwtToken,
        user: { id: githubUser.id, name: githubUser.name, email: githubUser.email }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'GitHub OAuth failed', error: error.message });
    }
  }
};

module.exports = githubOAuth;