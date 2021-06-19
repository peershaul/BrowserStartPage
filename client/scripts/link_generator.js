function start() {

}

window.onload = () => {
    fetch('http://localhost:2500/links', {
            mode: 'cors',
            cache: 'default',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => proccessData(data))
}

function proccessData(data) {
    let tindex = getStartTabIndex()
    const main_container = document.getElementById('links-main-container')

    for (let i = 0; i < data.length; i++) {
        const block = document.createElement('div')
        const cell = data[i]

        tindex++
        block.innerHTML = `<a href = '${cell.url}' tabindex = '-1' tindex='${tindex}'>${cell.name}</a>`
        block.className = 'block'

        if (cell.sublinks.length > 0) {
            const sublinks_container = document.createElement('div')
            const divider = 1 / (cell.sublinks.length + 2)

            for (let j = 0; j < cell.sublinks.length; j++) {
                const sublink = document.createElement('a')
                sublink.setAttribute('href', cell.sublinks[j]['url'])
                sublink.setAttribute('tabindex', -1)
                sublink.setAttribute('tindex', tindex + (divider * (j + 1)))
                sublink.text = cell.sublinks[j].name
                sublinks_container.appendChild(sublink)
            }

            block.appendChild(sublinks_container)
        }
        main_container.appendChild(block)
    }

    start_selection_engine()
}

function getStartTabIndex() {
    const elems = document.querySelectorAll('*')
    let greatest = -1
    for (let i = 0; i < elems.length; i++) {
        const tindex = parseFloat(elems[i].getAttribute('tindex'))
        if (Number.isInteger(tindex) && tindex > greatest)
            greatest = tindex
    }

    return greatest
}