import { createComment, getCommentById } from '../api/data.js';
import { html, render, until } from '../lib.js';
import { createSubmitHandler, getUserData } from '../util.js';
import { spinner } from './commons.js';


const commentsTemplate = (commentsPromise, hasUser, active, onToggle, onSubmit) => html`
<div class="section-title">Comments</div>
${hasUser ? commentForm(active, onToggle, onSubmit) : null}
<div class="comments">
    <ul>
        ${until(commentsPromise, spinner())}
    </ul>
</div>`;

const commentForm = (active, onToggle, onSubmit) => {
    if (active) {
        return html`
        <article class="new-comment">
            <h2>New comment</h2>
            <form @submit=${onSubmit} id="commentForm">
                <textarea name="content" placeholder="Type comment"></textarea>
                <input type="submit" value="Add comment">
            </form>
        </article>`;
    } else {
        return html`
        <article class="new-comment">
            <button @click=${onToggle} class="button">Add comment</button>
        </article>`;
    }
};

const commentCard = (comment) => html`
<li class="comment">
    <header>${comment.owner.username}<span class="comment-date">${(new Date(comment.createdAt)).toLocaleString()}</span></header>
    <p>${comment.content}</p>
</li>`;

export function commentsView(recipeId) {
    const parent = document.getElementById('comments-container');
    const commentsPromise = getCommentById(recipeId);
    const userData = getUserData()

    update();

    function update(active = false) {
        const result = commentsTemplate(loadComments(commentsPromise), userData, active, onToggle, createSubmitHandler(onSubmit, 'content'));
        render(result, parent);
    }

    function onToggle() {
        update(true);
    }

    async function onSubmit({ content }) {
        if (content == '') {
            return;
        }

        const result = await createComment(recipeId, { content });
        result.owner = { username: userData.username };
        result.content = content;

        (await commentsPromise).results.unshift(result);

        update();
    }
}

async function loadComments(commentsPromise) {
    const { results: comments } = await commentsPromise;

    return comments.map(commentCard);
}