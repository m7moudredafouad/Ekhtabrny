import { myAlert } from "./alert"
import {timeFormatter} from './utils'
import Axios from "axios"


// -- For Posts --  //
const pushPost = (element, post, user, where) => {
    const html = `<div class="post mb-1">
            <div class="post__info">
                <img src="/img/user.jpg" alt="user profile" class="post__info-photo">

                <div class="post__info-cont">
                    <div class="post__info-names">
                        <h4><a href="#" class="post__info-link">${user.name}</a></h4>
                        ${post.groupId? `<h4 class="post__info-postedIn pl1 pr1">></h4>
                        <h4><a href="/groups/${post.groupId._id}" class="post__info-link">${post.groupId.name}</a></h4>`: ''}
                    </div>
                    <a href="#" class="post__info-date">${timeFormatter(post.createdAt)}</a>
                </div>    
            </div>

            <div class="post__content">
                <p class="post__content-post">${post.content}</p>
            </div>

        
            <div class="post__social" id="${post._id}vote" ${post.groupId? `data-groupId="${post.groupId._id}"`: ''} data-postId="${post._id}">
                <div class="post__social-react ${post.voted? 'post__social-active': ''} ml-1" id="vote">Vote (${post.votes ? post.votes.length : 0})</div>
                <div class="post__social-react ml-1" id="postComment">Comment (${post.countComments || 0})</div>
            </div>

            <div class="post__comments" data-page="1" data-postId="${post._id}" id="${post._id}Comments">
                <form class="form" ${post.groupId? `data-groupId="${post.groupId._id}"`: ''}>
                    <div class="form__group">
                        <input type="text" class="form-input w80 mb-0" name="comment" placeholder="اكتب تعليقك هنا">
                        <button type="submit" id="createcommentForm" class="btn w10">تعليق</button>
                    </div>
                </form>
            </div>

        </div>`
    
    element.insertAdjacentHTML(where, html);
}

export const getGroupPosts = async (id = false, page) => {
    try{
        let res;
        if(id){
            res = await Axios.post(`http://localhost:3000/api/v1/groups/${id}/posts?page=${page}`)
        } else {
            res = await Axios.post(`http://localhost:3000/api/v1/groups/posts?page=${page}`)
        }
        
        if(res.data.status === 'Success'){
            const data = res.data.posts
            const loadMore = document.getElementById('loadMore');
            data.forEach(post => {
                post['voted'] = false

                const voted = post.votes.findIndex((vote)=> {
                    return res.data.me._id === vote.userId 
                })
                if(voted > -1){
                    post['voted'] = true
                }
                pushPost(loadMore, post, post.userId, 'beforebegin')
            });
        }

    } catch(err){
        myAlert('danger', 'There is an error, Please try again later')
    }
}

export const createPost = async (post) => {
    try{
        const feed = document.getElementById('groupFeed');
        const id = feed.getAttribute('data-id')

        const res = await Axios.post(`http://localhost:3000/api/v1/groups/${id}/newpost`, {post})

        if(res.data.status === 'Success'){
            pushPost(feed.children[0], res.data.post, res.data.user, 'afterend')
        }

    } catch(err){
        myAlert('danger', 'There is an error, Please try again later')
    }
}



// -- For Comments --  //

const pushComments = (element, comment, user, where) => {
    const html = `<div class="post__comments_comment">
            <div class="post__comments-info">
                <img src="/img/user.jpg" alt="user profile" class="post__comments-info--photo">

                <div class="post__comments-info--cont">
                    <h5 class="mbn-1"><a href="#" class="post__comments-info--link">${user.name}</a></h5>
                    <a href="#" class="link post__comments-info--date">${timeFormatter(comment.createdAt)}</a>
                </div>    
            </div>

            <div class="post__comments-content w90 mr-3">
                <p>${comment.content}</p>
            </div>

        </div>`;

    element.insertAdjacentHTML(where, html);
}

export const loadComments = async (groupId, postId) => {
    try{
        const postCommentsPlace = document.getElementById(`${postId}Comments`)
        const page = parseInt(postCommentsPlace.getAttribute('data-page'))
        console.log(page)
        const res = await Axios.get(`http://localhost:3000/api/v1/groups/${groupId}/post/${postId}/comment?page=${page}`)

        postCommentsPlace.setAttribute('data-page', (page + 1))
        console.log(parseInt(postCommentsPlace.getAttribute('data-page')))

        if(res.data.status === 'Success'){
            // Push Comments
            const comments = res.data.comments
            comments.forEach(comment => {
                pushComments(postCommentsPlace, comment, comment.userId, 'beforeend')
            })
        }

    } catch(err) {
        myAlert('danger', 'There is an error, Please try again later')
    }
}

export const createComment = async (id, postId, comment) => {
    try{
        const res = await Axios.post(`http://localhost:3000/api/v1/groups/${id}/post/${postId}/comment`, {comment})
        const postCommentsPlace = document.getElementById(`${postId}Comments`)

        if(res.data.status === 'Success'){
            // Push Comments
            pushComments(postCommentsPlace.children[0], res.data.comment, res.data.user, 'afterend')
        }

    } catch(err) {
        myAlert('danger', 'There is an error, Please try again later')
    }
}

export const vote = async (groupId, postId) => {
    try{
        const res = await Axios.post(`http://localhost:3000/api/v1/groups/${groupId}/post/${postId}/vote`)

        if(res.data.status === 'Success'){
            document.getElementById(`${postId}vote`).children[0].classList.toggle('post__social-active')
        }

    } catch(err){
        myAlert('danger', 'There is an error, Please try again later')
    }
}