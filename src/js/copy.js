(function () {
    function getSelectionText() {
        let selectedText = ''
        if (window.getSelection) { // all modern browsers and IE9+
            selectedText = window.getSelection().toString()
        }

        return selectedText
    }

    function copySelectionText() {
        let copysuccess // var to check whether execCommand successfully executed
        try {
            copysuccess = document.execCommand('copy') // run command to copy selected text to clipboard
        } catch (error) {
            copysuccess = false
        }

        return copysuccess
    }

    let tooltip // global variables oh my! Refactor when deploying!
    let hidetooltiptimer

    function createtooltip() { // call this function ONCE at the end of page to create tool tip object
        tooltip = document.createElement('div')
        tooltip.style.cssText =
            'display: none; position:absolute; background:black; color:white; padding:6px 12px;z-index:1000;' +
            'border-radius:25px; font-size:1.5rem;box-shadow:3px 3px 3px rgba(0,0,0,.4);' +
            'opacity:0;transition:opacity 0.3s'
        tooltip.innerHTML = 'Copied!'
        document.body.appendChild(tooltip)
    }

    function showtooltip(e) {
        const vnt = e || event
        clearTimeout(hidetooltiptimer)
        tooltip.style.left = vnt.pageX - 10 + 'px'
        tooltip.style.top = vnt.pageY + 15 + 'px'
        tooltip.style.opacity = 1
        tooltip.style.display = 'inline-block'
        hidetooltiptimer = setTimeout(() => {
            tooltip.style.opacity = 0
        }, 500)
    }

    createtooltip() // create tooltip by calling it ONCE per page. See "Note" below
    const cod = document.querySelectorAll('code[class*="Code"]')

    for (let h = 0; h < cod.length; h++) {
        cod[h].addEventListener('mouseup', e => {
            const selected = getSelectionText() // call getSelectionText() to see what was selected
            if (selected.length > 0) { // if selected text length is greater than 0
                const copysuccess = copySelectionText() // copy user selected text to clipboard
                showtooltip(e)
            }
        }, false)
    }
}())
