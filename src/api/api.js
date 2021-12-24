import { notify } from "../lib/notify.js";

const hostName = 'https://parseapi.back4app.com';

async function request(url, options) {

    try {
        const response = await fetch(hostName + url, options);
        if (response.ok != true) {
            if (response.status == 403) {
                sessionStorage.removeItem('userData')
            }

            const error = await response.json();
            throw new Error(error.error);
            
        }
        if (response.status == 204) {
            return response;
        } else {
            return response.json();
        }
    } catch (err) {
        notify(err.message);
        throw err;
    }
}


function createOptions(method = 'get', data) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': 'pkzvTNrjDizv5EpgfxEJw418DvLlnLpGiDwn9iA4',
            'X-Parse-REST-API-Key': 'ehDHDcl8eM3MnfxQFqJI1oORR369BCHtm3t3ztlO'
        }
    }

    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {
        options.headers['X-Parse-Session-Token'] = userData.token;
    }

    return options;
}

export async function get(url) {
    return request(url, createOptions());

}

export async function post(url, data) {
    return request(url, createOptions('post', data));

}

export async function put(url, data) {
    return request(url, createOptions('put', data));

}

export async function del(url) {
    return request(url, createOptions('delete'));

}


export async function login(username, password) {
    const result = await post('/login', { username, password });
    const userData = {
        email: result.email,
        username: result.username,
        id: result.objectId,
        token: result.sessionToken
    };

    sessionStorage.setItem('userData', JSON.stringify(userData))

}

export async function register(username, email, password) {
    const result = await post('/users', { email, username, password });
    const userData = {
        email: result.email,
        username: result.username,
        id: result.objectId,
        token: result.sessionToken
    };

    sessionStorage.setItem('userData', JSON.stringify(userData))
    return result
}


export async function logout() {
    post('/logout');
    sessionStorage.removeItem('userData')

}
