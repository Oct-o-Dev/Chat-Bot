// Backend route
app.get('/api/avatars', async (req, res) => {
    const randomId = Math.floor(Math.random() * 1000);
    const response = await axios.get(`https://api.multiavatar.com/45678945/${randomId}`, {
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', 'image/svg+xml');
    res.send(response.data);
  });