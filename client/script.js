// ====== SELECTION ENGINE ========

let primaries = []

class Selectable {

    constructor(elem, index, primary) {
        this.elem = elem
        this.primary = primary

        if (primary) primaries.push(this)

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


window.onload = function() {
    console.log(getTIndex())
}