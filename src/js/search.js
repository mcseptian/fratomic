'use strict';
(function () {
    const components = document.querySelector('#tree-components')
    const searchField = document.querySelector('#search')
    const searchButton = document.querySelector('#search-btn')
    const autoSearch = document.querySelector('#auto-search')
    const resultMessage = document.querySelector('#search-result')

    var hide = function (elem, next) {
        if (!(elem.tagName === 'LI' || elem.tagName === 'UL')) {
            next()
        } else {
            elem.setAttribute('hidden', 'true')
            elem.parentNode.querySelectorAll('li:not([hidden=true])').length === 0 ? hide(elem.parentNode, next) : next()
        }
    }

    var show = function (elem, next) {
        // if it's a collection, iterate
        if (elem.length > 0) {
            for (let i = elem.length; i--;) {
                show(elem[i], next)
            }

            return
        }

        if (!(elem.tagName === 'LI' || elem.tagName === 'UL')) {
            next()
        } else {
            elem.removeAttribute('hidden')
            elem.parentNode.querySelectorAll('li:not([hidden=true])').length > 0 ? show(elem.parentNode, next) : next()
        }
    }

    const displayResult = function () {
        resultMessage.innerText = components.querySelectorAll('li:not([hidden])>a').length + ' components found'
    }

    const filter = function () {
        const spans = components.querySelectorAll('span')
        const { value } = searchField
        let elementCount = spans.length

        // Callback for recursive loop function.
        const updateElementCount = function () {
            elementCount--
            if (elementCount <= 0) {
                displayResult()
            }
        }

        for (let i = spans.length; i--;) {
            if (spans[i].innerHTML.toUpperCase()
                .indexOf(value.toUpperCase()) === -1) {
                if (spans[i].parentNode.tagName === 'A') {
                    // Hide the wrapping LI tag.
                    hide(spans[i].parentNode.parentNode, updateElementCount)
                } else {
                    updateElementCount()
                }
            } else if (spans[i].parentNode.classList.contains('Tree-collectionLabel')) {
                // Unhide all nodes in the collection.
                const collection = spans[i].parentNode.parentNode.querySelectorAll('ul > li')
                // Update elementCount.
                elementCount += collection.length - 1
                show(collection, updateElementCount)
            } else {
                // Unhide the wrapping LI tag.
                show(spans[i].parentNode.parentNode, updateElementCount)
            }
        }
    }

    const addEvents = function () {
        if (!components) {
            return
        }

        if (searchField && autoSearch) {
            searchField.addEventListener('input', () => {
                // Only filter on input if autosearch is enabled.
                if (autoSearch.checked) {
                    filter()
                }
            })
        }

        if (searchButton) {
            searchButton.addEventListener('click', filter)
        }
    }

    addEvents()
})()
