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
            });
        })
        console.log('Data loaded.');
        items.pop()
        for (let item of items) {
            if(item.name.toLowerCase().includes('blueprint')) {
                item.type = 'blueprint';
            }
            else if(item.name.toLowerCase().includes('skin')) {
                item.type = 'skin';
            }
            else {
                item.type = 'item';
            }
        }
        startApp(PORT);
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
            console.log(`Request URL: "${req.url}", index.html sent`);
        });
        app.get('/items/all', (req, res) => {
            console.log(`Request URL: ${req.url}`)
            res.send(JSON.stringify(items));
        });
        app.get('/items', (req, res) => {
            console.log(req.url)
            let itemsByQuery = [];
            if (req.query.type === 'ships') {
                if (req.query.race) {
                    switch (req.query.race) {
                        case 'Caldari': {
                            for (let item of items) {
                                if (item.id[8] === '1' && item.type === 'item') {
                                    itemsByQuery.push(item);
                                }
                            }
                            break;
                        }
                        case 'Minmatar': {
                            for (let item of items) {
                                if (item.id[8] === '2' && !item.name.includes('blueprint') && !item.name.includes('skin')) {
                                    itemsByQuery.push(item);
                                }
                            }
                            break;
                        }
                        case 'Amarr': {
                            for (let item of items) {
                                if (item.id[8] === '3' && !item.name.includes('skin') && !item.name.includes('blueprint')) {
                                    itemsByQuery.push(item);
                                }
                            }
                            break;
                        }
                        case 'Gallente': {
                            for (let item of items) {
                                if (item.id[8] === '4' && !item.name.includes('skin') && !item.name.includes('blueprint')) {
                                    itemsByQuery.push(item);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if (req.query.name) {
                for (let item of items) {
                    if (item.name.toLowerCase().includes(req.query.name.toLowerCase())) {
                        if (req.query.blueprints && item.type === 'blueprint') itemsByQuery.push(item)
                        if(req.query.skins && item.type === 'skin') itemsByQuery.push(item)
                        if (item.type === 'item') itemsByQuery.push(item)
                    }
                }
                console.log(itemsByQuery)
            }
            res.send(JSON.stringify(itemsByQuery));
        });

    })

