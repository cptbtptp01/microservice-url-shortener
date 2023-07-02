// access mongodb
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const dns = require("dns");
const db = require("./db");

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// define routes and middleware

// validate url and store in database
app.post("/api/shorturl", async (req, res) => {
    try {
        const { url } = req.body;
        // validate url
        dns.lookup(url, (err) => {
            if (err) {
                return res.json({
                    error: "Invalid URL",
                });
            }
            // save to database
            const ShortUrl = require("./models/ShortUrl");
            const shortUrl = new ShortUrl({ originalUrl: url });

            shortUrl.save().then((result) => {
                res.json({
                    originalUrl: result.originalUrl,
                    shortUrl: result.shortUrl,
                });
            })
                .catch((error) => {
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// set up routes for redirecting from short URLs
app.get('/api/shorturl/:id', (req, res) => {
    const shortUrl = req.params.id;

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
                error: 'Internal server error'
            });
        });
});

// server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
