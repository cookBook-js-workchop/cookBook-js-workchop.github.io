import { html, classMap } from "../lib.js";

export const spinner = ()=>html`<p class="spinner">Loading &hellip;</p>`

export const field = ({label, name, type = 'text',placeholder='', error, value = ''}) => {
    if (type == 'textarea'){
        return html`<label class="ml">${label}: <textarea class=${classMap({error})} placeholder=${placeholder} name=${name} .value=${value}></label>`
    }else{
        return html`<label>${label}: <input class=${classMap({error})} type=${type} name=${name} .value=${value}></label>`
    }
}

export const errorMsg = (errors) => {
    if (errors) {
        return html`<p class="error">${errors.message}</p>`;
    } else {
        return null;
    }
};
