const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const { join } = require("path")
const path = require('path');
var useragent = require('express-useragent');

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'microphone=<allowlist>');

    next();
});

app.use(useragent.express());
app.use(express.static('web'))
app.use(express.static('landing'))
app.get('*', (req, res) => {
    if (req.useragent.isMobile) {
        res.sendFile(path.join(__dirname, 'landing', 'mobile_page.html'));
    } else {
        res.sendFile(path.join(__dirname, 'web', 'index.html'));
    }
});

app.use((req, res, next) => {
    const error = new Error('Url not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.json({
        status: false,
        message: error.message
    })
})
const port = (process.env.PORT || 8080)
app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
});