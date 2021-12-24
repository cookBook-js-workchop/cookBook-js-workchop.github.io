import { getUserData } from '../util.js';
import * as api from './api.js';


export const login = api.login
export const register = api.register
export const logout = api.logout

const pageSize = 5

const endPoints = {
    recent: `/classes/Recipe?limit=3&order=-createdAt`,
    recipes: (page, pageSize) => `/classes/Recipe?skip=${(page - 1) * pageSize}&limit=${pageSize}&count=1`,
    recipeSearch: (page, query, pageSize) => `/classes/Recipe?where=${createQuery(query)}&skip=${(page - 1) * pageSize}&limit=${pageSize}&count=1`,
    create: '/classes/Recipe',
    byId: '/classes/Recipe/',
    comments: '/classes/comment',
    details: (id) => `/classes/Recipe/${id}?include=owner`,
    getCommentById: (recipeId) => `/classes/comment/?where=${createPointerQuery('recipe','Recipe',recipeId)}&include=owner&order=-createdAt`
}

export function createPointerQuery(propName, className, objectId) {
    return createQuery({ [propName]: createPointer(className, objectId) })

}

export function createQuery(query) {
    return encodeURIComponent(JSON.stringify(query))
}

function createPointer(className, objectId) {
    return {
        __type: "Pointer",
        className,
        objectId
    }

}
function addOwner(record) {
    const { id } = getUserData()
    record.owner = createPointer('_User', id)
    return record
}
export async function getRecentRecipes() {
    return api.get(endPoints.recent)

}

export async function getAllRecipes(page, query) {
    const data = await (() => {
        if (query) {
            query = {
                name: {
                    $text: {
                        $search: {
                            $term: query,
                            $caseSensitive: false
                        }
                    }
                }
            };
            return api.get(endPoints.recipeSearch(page, query, pageSize));
        } else {
            return api.get(endPoints.recipes(page, pageSize));
        }
    })();
    data.pages = Math.ceil(data.count / pageSize);

    return data;
}

export async function getRecipeId(id) {
    return api.get(endPoints.byId + id)

}
export async function createRecipe(data) {
    addOwner(data)
    return api.post(endPoints.create, data)

}

export async function updateRecipe(id, data) {
    return api.put(endPoints.byId + id, data)

}

export async function deleteRecipe(id) {
    return api.del(endPoints.byId + id)
}

export async function getCommentById(recipeId) {
    return api.get(endPoints.getCommentById(recipeId))
}

export async function createComment(recipeId, comment){
    comment.recipe=createPointer('Recipe', recipeId)
    addOwner(comment)
    return api.post(endPoints.comments, comment)
}