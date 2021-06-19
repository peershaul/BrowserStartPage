// ====== SELECTION ENGINE ========

/**
 * Members of this class will be able to be selected in the selection engine
 */
class Selectable {

    constructor(elem, index) {
        this.elem = elem
        this.index = index
    }

    static unfocus = (primaries) => {
        for (let i = 0; i < primaries.length; i++) {

            if (primaries[i].elem.classList.contains('focus')) {
                primaries[i].elem.classList.remove('focus')
                if (primaries[i].elem.nodeName == 'INPUT')
                    primaries[i].elem.blur()
            }

            if (primaries[i].secondaries.length > 0)
                for (let j = 0; j < primaries[i].secondaries.length; j++)
                    if (primaries[i].secondaries[j].elem.classList.contains('focus'))
                        primaries[i].secondaries[j].elem.classList.remove('focus')
        }
    }

    focus = (primaries) => {
        const focused = find_focused(primaries)
        if (this !== focused)
            Selectable.unfocus(primaries)
        this.elem.classList.add('focus')
        if (this.elem.nodeName === 'INPUT')
            this.elem.focus()
    }
}


class PrimarySelectable extends Selectable {
    constructor(elem, index) {
        super(elem, index)
        this.secondaries = []
    }

    addSecondary = sec => {
        this.secondaries.push(sec)
    }
}

class SecondarySelectable extends Selectable {

    constructor(elem, index, parent) {
        super(elem, index)
        this.parent = parent
    }
}

/**  
    Looks at the entire document and searches for elements with tindex attribute
    And then sort them by the size of the number identified in the attribute
*/
function getTIndex() {
    const elems = document.querySelectorAll('*')


    let biggest_index = NaN
    let sorted_list = []

    for (let i = 0; i < elems.length; i++) {

        const tindex = parseFloat(elems[i].getAttribute('tindex'))
        if (!isNaN(tindex)) {
            if (isNaN(biggest_index) || tindex > biggest_index) {
                sorted_list.push([elems[i], tindex])
                biggest_index = tindex
            } else
                for (let j = 0; j < sorted_list.length; j++)
                    if (sorted_list[j][1] > tindex) {
                        sorted_list.splice(j, 0, [elems[i], tindex])
                        break
                    }
        }

    }

    return sorted_list

}
/**
 * Takes all the tindex element and divides them into primaries and secondaries,
 * return array of primaries and their secondaries inside those primaries
 * @param {Array} raw_list 
 * @returns Array of primaries
 */
function genHirarchy(raw_list) {
    let primaries = []
    for (let i = 0; i < raw_list.length; i++) {
        if (Number.isInteger(raw_list[i][1]))
            primaries.push(new PrimarySelectable(raw_list[i][0], raw_list[i][1]))

        else
            primaries[primaries.length - 1].addSecondary(
                new SecondarySelectable(raw_list[i][0], raw_list[i][1], primaries[primaries.length - 1])
            )
    }


    return primaries

}

function find_focused(primaries) {
    let focused = null
    for (let i = 0; i < primaries.length; i++) {
        const prime = primaries[i]
        let found = false
        if (prime.elem.classList.contains('focus')) {
            focused = prime
            found = true
        } else if (prime.secondaries.length > 0)
            for (let j = 0; j < prime.secondaries.length; j++)
                if (prime.secondaries[j].elem.classList.contains('focus')) {
                    focused = prime.secondaries[j]
                    found = true
                    break
                }

        if (found) break
    }
    return focused
}

function find_from_primaries(prime, primaries) {
    for (let i = 0; i < primaries.length; i++)
        if (prime == primaries[i])
            return i

    return NaN
}

function find_from_primary(secondary, prime) {
    for (let i = 0; i < prime.secondaries.length; i++)
        if (secondary == prime.secondaries[i])
            return i

    return NaN
}

function moveRight(primaries) {
    const focused = find_focused(primaries)
    let current = focused
    if (!Number.isInteger(focused.index)) current = focused.parent

    let index = find_from_primaries(current, primaries)
    if (index == primaries.length - 1) primaries[0].focus(primaries)
    else primaries[index + 1].focus(primaries)
}

function moveLeft(primaries) {
    const focused = find_focused(primaries)
    let current = focused
    if (!Number.isInteger(focused.index)) current = focused.parent

    let index = find_from_primaries(current, primaries)
    if (index == 0) primaries[primaries.length - 1].focus(primaries)
    else primaries[index - 1].focus(primaries)
}

function moveUp(primaries) {
    const focused = find_focused(primaries)
    const is_secondary = !Number.isInteger(focused.index)

    if (is_secondary) {
        const index = find_from_primary(focused, focused.parent)
        if (index == 0) focused.parent.focus(primaries)
        else focused.parent.secondaries[index - 1].focus(primaries)
    } else {
        const index = find_from_primaries(focused, primaries)
        if (index == 0) {
            if (primaries[primaries.length - 1].secondaries.length > 0)
                primaries[primaries.length - 1].secondaries[primaries[primaries.length - 1].secondaries.length - 1].focus(primaries)
            else primaries[primaries.length - 1].focus(primaries)
        } else if (primaries[index - 1].secondaries.length > 0)
            primaries[index - 1].secondaries[primaries[index - 1].secondaries.length - 1].focus(primaries)
        else primaries[index - 1].focus(primaries)

    }
}

function moveDown(primaries) {
    const focused = find_focused(primaries)
    const is_secondary = !Number.isInteger(focused.index)

    if (is_secondary) {
        const index = find_from_primary(focused, focused.parent)
        if (index == focused.parent.secondaries.length - 1) {
            const per_index = find_from_primaries(focused.parent, primaries)
            if (per_index == primaries.length - 1) primaries[0].focus(primaries)
            else primaries[per_index + 1].focus(primaries)
        } else focused.parent.secondaries[index + 1].focus(primaries)
    } else {
        const index = find_from_primaries(focused, primaries)
        if (focused.secondaries.length > 0) focused.secondaries[0].focus(primaries)
        else if (index == primaries.length - 1) primaries[0].focus(primaries)
        else primaries[index + 1].focus(primaries)
    }
}

function enterEvent(primaries, new_tab) {
    const focused = find_focused(primaries)
    if (focused.elem.nodeName == 'A')
        enterLink(focused, new_tab)
    else if (focused.elem == document.querySelector('#duck-searchbox input'))
        enterDuck(focused, new_tab)
}

function enterLink(focused, new_tab) {
    window.open(focused.elem.getAttribute('href'), new_tab ? '_blank' : '_self')
}

function enterDuck(focused, new_tab) {
    const txt = focused.elem.value
    window.open('https://duckduckgo.com/?t=ffab&q=' + txt, new_tab ? '_blank' : '_self')
}

window.onload = function() {
    const primaries = genHirarchy(getTIndex())
    primaries[0].focus(primaries)

    primaries[0].elem.onclick = () => primaries[0].focus(primaries)

    const keys = {
        right_arrow: 39,
        left_arrow: 37,
        up_arrow: 38,
        down_arrow: 40,
        enter: 13,
        tab: 9
    }

    const keyDown = e => {
        const evt = window.event ? event : e

        if (evt.shiftKey) {
            if (evt.keyCode == keys.right_arrow) {
                e.preventDefault()
                moveRight(primaries)
            } else if (evt.keyCode == keys.left_arrow) {
                e.preventDefault()
                moveLeft(primaries)
            } else if (evt.keyCode == keys.up_arrow) {
                e.preventDefault()
                moveUp(primaries)
            } else if (evt.keyCode == keys.down_arrow) {
                e.preventDefault()
                moveDown(primaries)
            }

        }

        if (evt.keyCode == keys.enter) {
            e.preventDefault()
            enterEvent(primaries, evt.shiftKey)
        }
    }


    document.onkeydown = keyDown
}