import { register } from '../api/api.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';
import { field } from './commons.js';



const registerTemplate = (onSubmit, errorMsg, data, error) => html`
<section id="login">
    <article>
        <h2>Login</h2>
        <form @submit="${onSubmit}" id="loginForm">
            ${errorMsg ? html`<p class="error">${errorMsg}</p>` : null}
            ${field({ label: 'Username', name: 'username', value: data.username, error: error.errors?.username })}
            ${field({ label: 'E-mail', name: 'email', value: data.email, error: error.errors?.email })}
            ${field({
    label: 'Password', type: 'password', name: 'password', value: data.password, error:
        error.errors?.password
})}
            ${field({
            label: 'Repeat', type: 'password', name: 'repass', value: data.repass, error: error.errors?.repass
            })}
            <input type="submit" value="Register">
        </form>
    </article>
</section>`;


export function registerPage(ctx) {
    update()

    function update(errorMsg = '', data = {}, error = { errors: { username: false, password: false } }) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit, 'username', 'email', 'password', 'repass'), errorMsg, data, error))
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

            if (data.password != data.repass) {
                throw {
                    error: new Error('Passwords don\'t match!'),
                    errors: { password: true, repass: true }
                };
            }

            await register(data.username, data.email, data.password);
            ctx.updateNav()
            ctx.page.redirect('/')
        }
        catch (err) {
            const message = err.message || err.error.message

            update(message, data, err)
        }
    }
}
