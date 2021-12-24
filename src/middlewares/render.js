import { render } from "../lib.js";
import { notify } from "../lib/notify.js";
import { getUserData } from "../util.js";

const root = document.querySelector('main')

function boundRender(content){
    render(content, root)
}


export function decorateContext(ctx, next){
    ctx.render = boundRender
    ctx.updateNav=updateNav
    next()

}


export function updateNav(){
    const userData = getUserData()
    if(userData){
        document.querySelector('#user').style.display = "inline-block"
        document.querySelector('#guest').style.display = "none"
        
    }else{
        document.querySelector('#user').style.display = "none"
        document.querySelector('#guest').style.display = "inline-block"
        
    }
}


export function initializeNotify() {
    return function(ctx, next) {
        ctx.notify = notify;

        next();
    };
}