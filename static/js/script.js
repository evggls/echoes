let loadBtn = document.querySelector('#loadButton'),
    inputField = document.querySelector('#itemName'),
    allItems = document.querySelector('#allItems'),
    output = document.querySelector('.outputList'),
    arrowIcon = document.querySelector('.arrowIcon');

arrowIcon.addEventListener('click', () => {
    arrowIcon.classList.toggle('rotateZ90');
    document.querySelector('.shipsList').classList.toggle('visuallyHidden')
})
loadBtn.addEventListener('click', () => {
    output.innerHTML = '';

    let reqURL = `http://localhost:5555/items/`;
    if (allItems.checked) {
        reqURL += 'all'
    }
    let req = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
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
            outputItem.classList.add('outputItem')
            outputItem.innerHTML = `<div>${item.name}</div>
                                    <div>ID: ${item.id}</div>
                                    <div>Min sell price: ${item.lowestSellPrice}</div>
                                    <div>Max buy price: ${item.lowestSellPrice}</div>`
            output.appendChild(outputItem);
        })

    })

})