const container = document.createElement('div')
container.id = 'notification'
const ul = document.createElement('ul')
container.appendChild(ul)
ul.addEventListener('click', onClick)
document.body.appendChild(container)

export function notify(message){
    const liEl = document.createElement('li')
    liEl.className = 'notification'
    liEl.textContent = message + ' \u2716'
    ul.appendChild(liEl)

    setTimeout(()=>liEl.remove(),3000)

}

function onClick(e){
    if (e.target.tagName == 'LI'){
        e.target.remove()
    }
}