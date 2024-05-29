import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const port = 3000;

app.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).send('Query is required');
    }

    try {
        const response = await axios.get(`https://www.google.com/search?q=${query}`);
        const html = response.data;
        const $ = cheerio.load(html);
        const results: string[] = [];

        $('a').each((i, element) => {
            const link = $(element).attr('href');

            if (link && link.startsWith('/url?q=')) {
                const url = link.split('/url?q=')[1].split('&')[0];
                results.push(url);
            }
        });

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});