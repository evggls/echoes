const express = require('express');
const app = express();
const PORT = 5555;
const axios = require('axios');
let items = [];

function startApp(PORT) {
    try {
        app.listen(PORT, () => {
            console.log(`SRV sratded. PORT: ${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}

app.use('/static', express.static(__dirname + '/static'));

startApp(PORT);

axios.get('https://api.eve-echoes-market.com/market-stats/stats.csv')
    .then(response => {
        let allData = response.data.split('\r\n');
        allData.shift(0);
        allData.forEach(elem => {
            let item = elem.split(',');
            items.push({
                id: item[0],
                name: item[1],
                sellPrice: item[3],
                buyPrice: item[4],
                lowestSellPrice: item[4],
                highestBuyPrice: item[5]
            })
        })
        console.log('Data loaded.')

        app.get('/', (req, res) => {
            console.log(`Request URL: ${req.url}`)
            res.sendFile(__dirname + '/index.html');
        });

        app.get('/items/all', (req, res) => {
            console.log(`Request URL: ${req.url}`)

            res.send(JSON.stringify(items));
        });

    })

