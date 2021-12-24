import { login } from '../api/data.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';
import { field } from './commons.js';



const loginTemplate = (onSubmit, errorMsg, username, error) => html`
<section id="login">
    <article>
        <h2>Login</h2>
        <form @submit="${onSubmit}" id="loginForm">
            ${errorMsg ? html`<p class="error">${errorMsg}</p>` : null}
            ${field({ label: 'Username', name: 'username', value: username, error: error.errors?.username })}
            ${field({ label: 'Password', name: 'password',type:"password",  value: username, error: error.errors?.password })}
            <input type="submit" value="Login">
        </form>
    </article>
</section>`;


export function loginPage(ctx) {
    update()

    function update(errorMsg = '', username = '', error = {errors:{ username: false, password: false }}) {
        ctx.render(loginTemplate(createSubmitHandler(onSubmit, 'username', 'password'), errorMsg, username, error))
    }

    async function onSubmit(data) {


        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '')
            if (missing.length > 0) {
                const errors = missing.reduce((a, [k, v]) => Object.assign(a, { [k]: true }), {})
                throw {
                    error: new Error('All fields are required!'),
                    errors
                }
            }
            await login(data.username, data.password);
            ctx.updateNav()
            ctx.page.redirect('/')
        }
        catch (err) {
            const message = err.message || err.error.message
            
            update(message, data.username, err)
        }
    }
}
