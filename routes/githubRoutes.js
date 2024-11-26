const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL

// Route for GitHub OAuth
router.get('/auth', (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user`;
    res.redirect(redirectUri);
});

// GitHub OAuth Callback
router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
        }, {
        headers: { Accept: 'application/json' },
        });

        const accessToken = tokenResponse.data.access_token;
        res.cookie('github_token', accessToken, {httpOnly: true, sameSite: 'Lax'});
        res.redirect('http://localhost:8080');
    } catch (err) {
        console.error('GitHub OAuth Error:', err);
        res.status(500).send('GitHub OAuth Error');
    }
});

router.get('/repos', async (req, res) => {
    const token = req.cookies.github_token;
    if (!token) return res.status(401).send('Not authenticated with GitHub');

    try {
        const reposRes = await axios.get('https://api.github.com/user/repos', {
            headers: { Authorization: `token ${token}` },
        });
        res.json(reposRes.data);
    } catch (err) {
        console.error('GitHub API Error:', err);
        res.status(500).send('Error fetching GitHub repositories');
    }
});

router.post('/repos', async (req, res) => {
    const token = req.cookies.github_token;
    if (!token) return res.status(401).send('Not authenticated with GitHub');

    const { name, description, privateRepo } = req.body;

    try {
        const createRepoRes = await axios.post('https://api.github.com/user/repos', {
            name: name,
            description: description || '',
            private: privateRepo || false, // If no value is provided, default to public repo
        }, {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            }
        });
        res.json(createRepoRes.data);
    } catch (err) {
        console.error('GitHub API Error:', err);
        res.status(500).send('Error fetching GitHub repositories');
    }
});

router.get('/repos/:owner/:repo/contents/:path*?', async (req, res) => {
    const { owner, repo, path = '' } = req.params; // path can be optional
    const token = req.cookies.github_token;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    let repoPath = path ? path : '';

    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, {
            headers: { Authorization: `token ${token}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching repository contents:', error);
        res.status(500).send('Error fetching repository contents');
    }
});

module.exports = router;