const eventMap = new Map()



const emitEvent = function (type, event) {
    if(eventMap.has(type)) {
        const eventList = eventMap.get(type)
        if(typeof eventList === 'object') {
            for (const cb of eventList) {
                if(typeof cb === 'function') cb(event)
            }
        }
    }
}




const addEvent = function (type, cb) {
    if(typeof cb === 'function') {
        if(!eventMap.has(type)) eventMap.set(type, [])
        const eventList = eventMap.get(type) || []
        if(!eventList.includes(cb)) {
            eventList.push(cb)
            eventMap.set(type, eventList)
        }
    }
}


const removeEvent = function (type, cb) {
    if(typeof cb === 'function') {
        if(!eventMap.has(type)) eventMap.set(type, [])
        const eventList = eventMap.get(type) || []
        const index = eventList.indexOf(cb)
        if(index !== -1) eventList.splice(index, 1)
        eventMap.set(type, eventList)
    }
}


export {
    addEvent,
    emitEvent,
    removeEvent
}