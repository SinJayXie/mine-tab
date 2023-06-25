import './style.scss'


const createMask = function () {
    const mask = document.createElement("div")
    mask.className = "ui-message"
    return mask
}

const createElement = (className) => {
    const element = document.createElement('div')
    element.className = className
    return element
}

const createButton = (text) => {
    const element = document.createElement('button')
    element.innerText = text
    return element
}


function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
}


class UIMessage {
    constructor() {
        this.messages = new Map()
    }


    alert(title, context = "") {

        const mask = createMask()
        const alertContent = createElement(mask.className + '__alert')

        if(title) {
            const title_ = createElement(alertContent.className + '_title')
            title_.innerText = title
            alertContent.appendChild(title_)
        }


        const content = createElement(alertContent.className + '_context')

        content.innerHTML = context

        alertContent.appendChild(content)

        const footer = createElement(alertContent.className + '_footer')

        const okbutton = createButton("Okay")

        footer.appendChild(okbutton)

        alertContent.appendChild(footer)


        mask.appendChild(alertContent)

        document.body.appendChild(mask)

        const id = uuid()

        this.messages.set(id, {
            id,
            mask,
            content: alertContent
        })

        okbutton.addEventListener("click", (ev) => {
            ev.stopPropagation()
            ev.preventDefault()

            this.closeMessage(id)
        })

        mask.setAttribute("data-uuid", id)

        return id
    }


    confirm(title, context = "", okText, cancelText) {

        const mask = createMask()
        const alertContent = createElement(mask.className + '__alert')

        if(title) {
            const title_ = createElement(alertContent.className + '_title')
            title_.innerText = title
            alertContent.appendChild(title_)
        }


        const content = createElement(alertContent.className + '_context')

        content.innerHTML = context

        alertContent.appendChild(content)

        const footer = createElement(alertContent.className + '_footer')

        const okbutton = createButton(okText || "Okay")
        const cancelButton = createButton(cancelText || "Cancel")

        footer.appendChild(okbutton)
        footer.appendChild(cancelButton)

        alertContent.appendChild(footer)


        mask.appendChild(alertContent)

        document.body.appendChild(mask)

        const id = uuid()

        this.messages.set(id, {
            id,
            mask,
            content: alertContent
        })
        mask.setAttribute("data-uuid", id)

        return new Promise((resolve, reject) => {
            okbutton.addEventListener("click", (ev) => {
                ev.stopPropagation()
                ev.preventDefault()
    
                this.closeMessage(id)

                resolve(true)
            })
    
            cancelButton.addEventListener("click", (ev) => {
                ev.stopPropagation()
                ev.preventDefault()
    
                this.closeMessage(id)

                reject(new Error("Cancel button submit"))
            })
        })

    }

    prompt(title, context, defaultValue, cb) {
        const mask = createMask()
        const alertContent = createElement(mask.className + '__alert')

        if(title) {
            const title_ = createElement(alertContent.className + '_title')
            title_.innerText = title
            alertContent.appendChild(title_)
        }


        const content = createElement(alertContent.className + '_context')

        const tipsTitle = createElement(content.className + '_label')
        tipsTitle.innerText = context

        content.appendChild(tipsTitle)


        const input = createElement(content.className + '_input')
        content.appendChild(input)


        const input_content = document.createElement('input')

        if(defaultValue) {
            input_content.value = defaultValue
            input_content.placeholder = defaultValue
        }
        
        input.appendChild(input_content)




        alertContent.appendChild(content)

        const footer = createElement(alertContent.className + '_footer')

        const okbutton = createButton("Okay")
        const cancelButton = createButton("Cancel")

        footer.appendChild(okbutton)
        footer.appendChild(cancelButton)

        alertContent.appendChild(footer)


        mask.appendChild(alertContent)

        document.body.appendChild(mask)

        const id = uuid()

        this.messages.set(id, {
            id,
            mask,
            content: alertContent
        })

        okbutton.addEventListener("click", (ev) => {
            ev.stopPropagation()
            ev.preventDefault()

            this.closeMessage(id)
            if(typeof cb === 'function') cb(input_content.value)
        })

        cancelButton.addEventListener("click", (ev) => {
            ev.stopPropagation()
            ev.preventDefault()

            this.closeMessage(id)

        })

        mask.setAttribute("data-uuid", id)

        return id
    }



    closeMessage(id) {
        if(this.messages.has(id)) {
            const target = this.messages.get(id)
            target.mask.classList.add("ui-message-remove")
            target.content.classList.add("ui-message-remove-content")
            setTimeout(() => {
                target.mask.remove()
            }, 390)
        } else {
            return false
        }
    }
}


export default new UIMessage()