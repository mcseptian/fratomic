'use strict';

(function () {
    const header = document.querySelector('.Frame-header')
    const sidebar = document.querySelector('.Frame-panel--sidebar')

    header.addEventListener('click', e => {
        if (sidebar) {
            sidebar.style.display = (window.getComputedStyle(sidebar).display === 'none') ? 'block' : 'none'
        }
    }, false)

    window.addEventListener('resize', e => {
        if (window.innerWidth >= 1024) {
            sidebar.style.display = 'block'
            header.textContent = 'menu'
        } else {
            sidebar.style.display = 'none'
            header.textContent = 'menu'
        }
    })
})()
