
import { logout } from "./api/api.js";
import {page} from "./lib.js"
import { notify } from "./lib/notify.js";
import  {decorateContext, initializeNotify, updateNav } from './middlewares/render.js';
import { catalogPage } from "./views/catalog.js";
import { createPage } from "./views/create.js";
import { detailsPage } from "./views/details.js";
import { editPage } from "./views/edit.js";
import { homePage } from "./views/home.js";
import { loginPage } from "./views/login.js";
import { registerPage } from "./views/register.js";

page(decorateContext);
page(initializeNotify());
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/catalog', catalogPage)
page('/create', createPage)
page('/details/:id', detailsPage)
page('/edit/:id', editPage)
updateNav()
page.start();


document.getElementById('logoutBtn').addEventListener('click',()=>{
    logout()
    updateNav()
    page.redirect('/')
})

