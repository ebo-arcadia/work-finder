const createServer = require('http').createServer;
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
};

const decodeParams = searchParams => Array
    .from(searchParams.key())
    .reduce((acc, key) => (
        { ...acc, [key]: searchParams.get(key) }
    ), {});

const server = createServer((req, res) => {
    const requestURL = url.parse(req.url);
    const decodeParams = decodeParams(new url.URLSearchParams(requestURL.search));
    const { search, location, country = 'us'} = decodeParams;

    const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.APP_ID}&app_key=${config.API_KEY}&what=${search}&where=${location}`;
    if (req.method === 'GET') {
        console.log(chalk.green(`proxy GET request to: ${targetURL}`));
        axios.get(targetURL)
            .then(response => {
                response.writeHead(200, headers);
                response.end(JSON.stringify(response.data));
            })
            .catch(error => {
                console.log(chalk.red(error));
                response.writeHead(500, headers);
                response.end(JSON.stringify(error));
            })
    }
})