/**
* @fileOverview svelte - the lightweight modern DOM manipulation and events library
* @author Matt Begent
* @version 1.4.3
*/

(function (window, document) {
    'use strict'

    const domProto = {

        /**
         * Each loop
         * @memberOf Dom
         * @param {function} callback Function to be run on each selector
         * @returns Dom
         * @example
         * $('.each').each(function() { });
         */
        each(callback) {
            for (let i = 0, len = this.s.length; i < len; i++) {
                callback(this.s[i])
            }

            return this
        },

        /**
         * Find a new selector within a parent selector
         * @memberOf Dom
         * @param {string} selector Find a new selector within a parent selector
         * @returns Dom
         * @example
         * $('.parent').find('.child');
         */
        find(selector) {
            return new Dom(selector, this.s[0])
        },

        /**
         * Set the CSS for an element
         * @memberOf Dom
         * @param {string} property Property of element to set
         * @param {string} value Value of property to set
         * @returns Dom
         * @example
         * $('.color').css('color', 'red');
         */
        css(property, value) {
            if (value) {
                return this.each(el => {
                    el.style[property] = value
                })
            }

            return getComputedStyle(this.s[0])[property]
        },

        /**
         * Sets selector to display none
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.hide').hide();
         */
        hide() {
            return this.each(el => {
                el.style.display = 'none'
            })
        },

        /**
         * Sets selector to display block
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.show').show();
         */
        show() {
            return this.each(el => {
                el.style.display = 'block'
            })
        },

        /**
         * Checks whether the selector is visible
         * @memberOf Dom
         * @returns Boolean
         * @example
         * $('.visible').visible();
         */
        visible() {
            if (this.s.length > 0) {
                return this.s[0].offsetWidth > 0 || this.s[0].offsetHeight > 0
            }

            return false
        },

        /**
         * Toggles the display property of the selector
         * @memberOf Dom
         * @returns Boolean
         * @example
         * $('.visible').visible();
         */
        toggle() {
            return this.each(el => {
                if (el.style.display === '' || el.style.display === 'block') {
                    el.style.display = 'none'
                } else {
                    el.style.display = 'block'
                }
            })
        },

        /**
         * Adds a class to the selector
         * @memberOf Dom
         * @param {string} className Name of class to add
         * @returns Dom
         * @example
         * $('.class').addClass('another-class');
         */
        addClass(className) {
            return this.each(el => {
                el.classList.add(className)
            })
        },

        /**
         * Removes a class from the selector
         * @memberOf Dom
         * @param {string} className Name of class to remove
         * @returns Dom
         * @example
         * $('.class remove-class').removeClass('remove-class');
         */
        removeClass(className) {
            return this.each(el => {
                el.classList.remove(className)
            })
        },

        /**
         * Toggles a class from the selector
         * @memberOf Dom
         * @param {string} className Name of class to toggle
         * @returns Dom
         * @example
         * $('.class toggle-class').toggleClass('toggle-class');
         */
        toggleClass(className) {
            return this.each(el => {
                el.classList.toggle(className)
            })
        },

        /**
         * Checks whether the selector has a specific class
         * @memberOf Dom
         * @returns Boolean
         * @example
         * $('.class').hasClass('another-class');
         */
        hasClass(className) {
            if (this.s.length > 0) {
                return this.s[0].classList.contains(className)
            }

            return false
        },

        /**
         * Attaches an event to the selector
         * @memberOf Dom
         * @param {string} name Name of event e.g. click or names of events separated by spaces e.g. 'keyup keydown'
         * @param {function} callback Callback to run when event is triggered
         * @returns Dom
         * @example
         * $('.click-me').on('click', function() { alert('Clicked!'); });
         */
        on(name, callback) {
            return this.each(el => {
                name.split(' ').forEach(ev => {
                    el.addEventListener(ev, callback)
                })
            })
        },

        /**
         * Attaches an event to the selector and removes after callback
         * @memberOf Dom
         * @param {string} name Name of event e.g. 'click' or names of events separated by spaces e.g. 'keyup keydown'
         * @param {function} callback Callback to run when event is triggered
         * @returns Dom
         * @example
         * $('.click-me').one('click', function() { alert('Clicked!'); });
         */
        one(name, callback) {
            return this.each(el => {
                name.split(' ').forEach(ev => {
                    var callbackWithRemove = function () {
                        callback()
                        el.removeEventListener(ev, callbackWithRemove) // remove event
                    }

                    el.addEventListener(ev, callbackWithRemove)
                })
            })
        },

        /**
         * Removes an event from the selector
         * @memberOf Dom
         * @param {string} name Name of event e.g. click or names of events separated by spaces e.g. 'keyup keydown'
         * @param {function} callback Callback to run when event is triggered
         * @returns Dom
         * @example
         * $('.click-me').off('click', function() { alert('Clicked!'); });
         */
        off(name, callback) {
            return this.each(el => {
                name.split(' ').forEach(ev => {
                    el.removeEventListener(ev, callback)
                })
            })
        },

        /**
         * Sets the first selector to be focussed
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.focus').focus();
         */
        focus() {
            if (this.s.length > 0) {
                this.s[0].focus()
            }

            return this
        },

        /**
         * Removes keyboard focus from first selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.blur').blur();
         */
        blur() {
            if (this.s.length > 0) {
                this.s[0].blur()
            }

            return this
        },

        /**
         * Trigger an event from the selector
         * @memberOf Dom
         * @param {string} name Name of event e.g. click
         * @param {object} detail The data passed when initializing the event
         * @returns Dom
         * @example
         * $('.click-me').trigger('click');
         */
        trigger(name, detail) {
            return this.each(el => {
                const triggerEvent = ((detail) ? new CustomEvent(name, detail) : document.createEvent('HTMLEvents'))
                if (!detail) {
                    triggerEvent.initEvent(name, true, false)
                }

                el.dispatchEvent(triggerEvent)
            })
        },

        /**
         * Find the previous sibling to the current selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.selector').prev();
         */
        prev() {
            if (this.s.length > 0) {
                this.s = this.s[0].previousElementSibling
            } else {
                this.s = []
            }

            return this
        },

        /**
         * Find the next sibling to the current selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.selector').next();
         */
        next() {
            if (this.s.length > 0) {
                this.s = this.s[0].nextElementSibling
            } else {
                this.s = []
            }

            return this
        },

        /**
         * Find the first element of the selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.selector').first();
         */
        first() {
            if (this.s.length > 0) {
                this.s = this.s[0]
            }

            return this
        },

        /**
         * Find the last element of the selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.selector').last();
         */
        last() {
            if (this.s.length > 0) {
                const arrayLength = this.s.length
                this.s = this.s.slice(arrayLength - 1, arrayLength)
            }

            return this
        },

        /**
         * Find the parent of the selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.selector').parent();
         */
        parent() {
            if (this.s.length > 0) {
                this.s = this.s[0].parentNode
            }

            return this
        },

        /**
         * Find the children of the selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.selector').children();
         */
        children() {
            if (this.s.length > 0) {
                this.s.slice.call(this.s[0].children)
            } else {
                this.s = []
            }

            return this
        },

        /**
         * Add HTML to the page in relation to the current selector
         * @memberOf Dom
         * @param {string} position The position to add the html - before, after, start, end
         * @param {string} html The HTML to add
         * @returns Dom
         * @example
         * $('.html').append('before','<p>I am before</p>');
         */
        append(position, html) {
            return this.each(el => {
                switch (position.toLowerCase()) {
                case 'before':
                    return el.insertAdjacentHTML('beforebegin', html)
                case 'after':
                    return el.insertAdjacentHTML('afterend', html)
                case 'start':
                    return el.insertAdjacentHTML('afterbegin', html)
                case 'end':
                    return el.insertAdjacentHTML('beforeend', html)
                }
            })
        },

        /**
         * Set the text of a selector
         * @memberOf Dom
         * @param {string} text Text to set
         * @returns Dom or text
         * @example
         * $('.text').text('Some text.');
         */
        text(text) {
            if (text) {
                return this.each(el => {
                    el.textContent = text
                })
            }

            return this.s[0].textContent.trim()
        },

        /**
         * Set the HTML of a selector
         * @memberOf Dom
         * @param {string} html HTML to set
         * @returns Dom or HTML
         * @example
         * $('.text').html('<span>A span.</span>');
         */
        html(html) {
            if (html) {
                return this.each(el => {
                    el.innerHTML = html
                })
            }

            return this.s[0].innerHTML
        },

        /**
         * Set the outerHTML of a selector
         * @memberOf Dom
         * @param {string} html HTML to set
         * @returns Dom or HTML
         * @example
         * $('.text').outerHTML('<span>A span.</span>');
         */
        outerHTML(html) {
            if (html) {
                return this.each(el => {
                    el.outerHTML = html
                })
            }

            return this.s[0].outerHTML
        },

        /**
         * Empty the HTML of a selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.empty-me').empty();
         */
        empty() {
            return this.each(el => {
                el.innerHTML = ''
            })
        },

        /**
         * Clone a selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.empty-me').clone();
         */
        clone() {
            return this.each(el => {
                el.clodeNode(true)
            })
        },

        /**
         * Removes a selector
         * @memberOf Dom
         * @returns Dom
         * @example
         * $('.remove-me').remove();
         */
        remove() {
            return this.each(el => {
                el.parentNode.removeChild(el)
            })
        },

        /**
         * Get or set the attribute of a selector
         * @memberOf Dom
         * @param {string} name Attr to get or set
         * @param {string} value Value to set
         * @returns Dom
         * @example
         * $('.get-attr').attr('data-attr');
         * $('.set-attr').attr('data-attr','Value');
         */
        attr(name, value) {
            if (!value) {
                return this.s[0].getAttribute(name)
            }

            return this.each(el => {
                el.setAttribute(name, value)
            })
        },

        /**
         * Remove an attribute from a selector
         * @memberOf Dom
         * @param {string} name Attr to remove
         * @returns Dom
         * @example
         * $('.attr').removeAttr('data-attr');
         */
        removeAttr(name) {
            return this.each(el => {
                el.removeAttribute(name)
            })
        },

        /**
         * Get the value of a selector
         * @memberOf Dom
         * @param {string} value Value to set
         * @returns value
         * @example
         * $('.input').val();
         */
        val(value) {
            if (value) {
                return this.each(el => {
                    el.value = value
                })
            }

            if (this.s.length > 0) {
                return this.s[0].value
            }

            return undefined
        },

        /**
         * Get the number of matched elements in the selector
         * @memberOf Dom
         * @returns length
         * @example
         * $('.length').length();
         */
        length() {
            return this.s.length
        },

        /**
         * Get the height of the first element in the selector
         * @memberOf Dom
         * @returns number height
         * @example
         * $('.height').height();
         */
        height() {
            if (this.s.length > 0) {
                return this.s[0].offsetHeight
            }

            return null
        },

        /**
         * Get the width of the first element in the selector
         * @memberOf Dom
         * @returns number width
         * @example
         * $('.width').width();
         */
        width() {
            if (this.s.length > 0) {
                return this.s[0].offsetWidth
            }

            return null
        },

        /**
         * Returns the position of the first element in the selector relative to the viewport
         * @memberOf Dom
         * @returns TextRectangle object
         * @example
         * $('.position').position();
         */
        position() {
            if (this.s.length > 0) {
                return this.s[0].getBoundingClientRect()
            }

            return null
        },

        /**
         * Returns true if the element matches the selector string
         * @memberOf Dom
         * @param {string} selector Selector to match
         * @returns boolean
         * @example
         * $('.paragraph').matches('p');
         */
        matches(selector) {
            return this.s[0].matches(selector)
        },

        /**
         * Returns closest element to selector
         * @memberOf Dom
         * @param {string} selector Selector to match
         * @returns Dom
         * @example
         * $('.logo').closest('.header');
         */
        closest(selector) {
            return new Dom(this.s[0].closest(selector))
        }

    }

    /** @constructor Dom */
    function Dom(selector, context) {
        return Object.create(domProto, {
            s: {
                get() {
                    if (typeof selector === 'string') {
                        const startAt = ((context === 'string') ? document.querySelectorAll(selector) : context) || document // tidy up
                        const nl = startAt.querySelectorAll(selector)
                        const arr = []

                        for (let i = 0, len = arr.length = nl.length; i < len; i++) {
                            arr[i] = nl[i]
                        }

                        return arr
                    }

                    return [selector] // could be an object, dom node or a function but always kept in an array
                },
                set(value) {
                    selector = value
                }
            }
        })
    }

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(() => {
            return Dom
        })
    }

    // Expose dom to the world:-)
    window.$ = window.Dom = Dom

    // Expose functions to the world
    window.$.fn = domProto
}(window, document))

// Polyfills

// Matches - prefixed in IE, IOS7 Safari and older Android browser versions
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
}

// Closest - not yet supported by IE and Safari
if (!Element.prototype.closest) {
    Element.prototype.closest = function closest(selector) {
        let node = this
        while (node) {
            if (node.matches(selector)) {
                return node
            }

            node = node.parentElement
        }

        return null
    }
}
