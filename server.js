const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/redirect', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    // Follow all redirects manually
    let finalUrl = url;
    let response = await axios.get(finalUrl, {
      maxRedirects: 5, // Follow up to 5 redirects
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (response.request.res.responseUrl) {
      finalUrl = response.request.res.responseUrl;
    }

    res.send(finalUrl);
  } catch (error) {
    console.error('Error fetching redirected URL:', error.message);
    res.status(500).send('Error fetching the redirected URL');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
