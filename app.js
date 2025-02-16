const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const Url = require('./models/Url');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortCode = shortid.generate();

    try {
        await Url.create({ originalUrl, shortCode });
        res.render('result', { originalUrl, shortCode });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/:shortCode', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });
        if (url) {
            return res.redirect(url.originalUrl);
        }
        res.status(404).send('URL not found');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));