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

    focus = (focused, primaries) => {
        if (this !== focused)
            Selectable.unfocus(primaries)
        focused = this
        this.elem.classList.add('focus')
        if (this.elem.nodeName === 'INPUT')
            this.elem.focus()

        return focused
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
                new SecondarySelectable(raw_list[i][0], raw_list[i][1])
            )
    }


    return primaries

}

window.onload = function() {
    const primaries = genHirarchy(getTIndex())
    let focused = primaries[0]
    let index = 0
    setInterval(() => {
        index++
        if (index == primaries.length) index = 0
        focused = primaries[index].focus(focused, primaries)
        console.log(focused.elem)
    }, 2000)
}