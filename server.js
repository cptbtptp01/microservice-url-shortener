require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const shortid = require('shortid');
const db = require('./db');

const cors = require('cors');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// parse POST bodies
app.use(bodyParser.urlencoded({ extended: false })); // use classic encoding
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Handle POST request to validate URL and store in the database
app.post('/api/shorturl', async (req, res) => {
    try {
        const { url } = req.body;

        if (!validUrl.isWebUri(url)) {
            return res.json({ error: "Invalid URL" });
        }

        // generate short id
        const shortUrl = shortid.generate();

        // Save to database
        const ShortUrl = require("./models/ShortUrl");
        const shortUrlDocument = new ShortUrl({ originalUrl: url, shortUrl });

        // after calling save(), a Promise returned
        // then() method is chained to the Promise, it takes a callback function as an argument
        // allow us to handle the successful completion of the save operation
        // ensure that the JSON response is sent to the client after the document is successfully saved in the database
        shortUrlDocument.save()
            .then((result) => {
                console.log('Data saved to database:', result);
                res.json({
                    original_url: result.originalUrl,
                    short_url: result.shortUrl,
                });
            })
            .catch((error) => {
                console.error(error); // log error
                res.status(500).json({ error: 'Internal Server Error1' });
            });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error2' });
    }
});

// Set up routes for redirecting from short URLs
app.get('/api/shorturl/:id', (req, res) => {
    const shortUrl = req.params.id;

    const ShortUrl = require("./models/ShortUrl");
    ShortUrl.findOne({ shortUrl })
        .then((result) => {
            if (!result) {
                return res.json({
                    error: 'Short URL not found'
                });
            }
            res.redirect(result.originalUrl);
        })
        .catch((error) => {
            res.status(500).json({
                error: 'Internal server error3'
            });
        });
});


app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
