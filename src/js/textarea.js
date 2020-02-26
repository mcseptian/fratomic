'use strict';

(function () {
    const textarea = document.querySelector('textarea')

    textarea.addEventListener('scroll', autosize)

    function autosize() {
        const el = this
        setTimeout(() => {
            el.style.cssText = '-moz-box-sizing:content-box'
            el.style.cssText = 'height:' + el.scrollHeight + 'px'
        }, 0)
    }
})()
