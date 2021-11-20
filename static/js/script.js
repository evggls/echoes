let loadBtn = document.querySelector('#loadButton'),
    inputField = document.querySelector('#itemName'),
    allItems = document.querySelector('#allItems'),
    output = document.querySelector('.outputList'),
    raceSelector = document.querySelector('#race'),
    itemType = document.querySelector('#itemType'),
    bps = document.querySelector('#bp'),
    skins = document.querySelector('#skins');

raceSelector.addEventListener('change', () => {
    inputField.value = '';
})

itemType.addEventListener('change', () => {
    inputField.value = '';
})


loadBtn.addEventListener('click', () => {
    output.innerHTML = '';

    let reqURL = `http://localhost:5555/items`;

    let req = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        if (allItems.checked) {
            reqURL += '/all'
        } else if (inputField.value) {
            reqURL += `?name=${inputField.value}`;
            if(bps.checked) {
                reqURL += `&blueprints=true`;
            }
            if(skins.checked) {
                reqURL += `&skins=true`;
            }


        } else {

            if (itemType) reqURL += `?type=${itemType.value}`
            if (raceSelector.value) reqURL += `&race=${raceSelector.value}`;

        }
        console.log(reqURL)
        xhr.open('GET', reqURL, true);
        xhr.send();
        xhr.onloadend = () => {
            resolve(xhr.response)
        }
        xhr.onerror = () => {
            reject(xhr.responseText)
        }
    })
    req.then(response => {
        let resp = JSON.parse(response);
        resp.forEach(item => {
            let outputItem = document.createElement('li');
            outputItem.classList.add(`i${item.id}`)
            outputItem.classList.add('outputItem')
            outputItem.innerHTML = `<div class="itemName">${item.name}</div>
                                    <div class="itemID">ID: ${item.id}</div>
                                    <div class="minSell">Min sell price: ${item.lowestSellPrice}</div>
                                    <div class="maxBuy">Max buy price: ${item.lowestSellPrice}</div>`
            output.appendChild(outputItem);

            outputItem.addEventListener('click', () =>{

            })
        })

    })

})

let outputitem = document.querySelectorAll('.outputItem');


