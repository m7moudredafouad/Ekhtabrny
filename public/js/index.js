import '@babel/polyfill'
import {hideMe, myAlert} from './alert';
import {removeChild, timer} from './utils';
import {login, logout} from './login';
import {closeMe, showJoinGroup, showCreateGroup, joinGroup, createGroup} from './createGroup';
import {acceptMember, removeMember} from './members';
import {nextQuiz, removeQuiz} from './quiz';
import {finishQuiz} from './answer';
import {exportToExcel} from './excel';
import {getGroupPosts, createPost, loadComments, createComment, vote} from './post';

// Next quiz timer
const nextQuizElement = document.getElementById('quizStartsAt');
if(nextQuizElement) { timer(nextQuizElement) }

// Export Excel
const exportExcel = document.getElementById('export');
if(exportExcel){ exportExcel.addEventListener('click', exportToExcel) }


// Login Form
const loginForm = document.forms['login'];
if(loginForm){
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        login(email, password)
    });
}

const logoutBtn = document.querySelector('#logout');
if(logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout()
    })
}

// Join group
const joinForm = document.forms['joinGroup'];
if(joinForm){
    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupid = joinForm.groupid.value;
        const name = joinForm.name.value;
        const code = joinForm.code.value;

        if(groupid && name && code) {
            joinGroup(groupid, name, code)
        } else {
            myAlert('danger', 'Please fill all inputs')
        }
    })
}

// Join group MODAL
// Close
const closeJoinModel = document.getElementById('closeJoin')
if(closeJoinModel){
    closeJoinModel.addEventListener('click', () => {
        closeMe(closeJoinModel)
    })
}
// Show
const showJoinGroupModel = document.getElementById('showJoinGroupModel')
if(showJoinGroupModel){
    showJoinGroupModel.addEventListener('click', (e) => {
        e.preventDefault()
        showJoinGroup()
    })
}

// Create group
const createForm = document.forms['createGroup'];
if(createForm){
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = createForm.groupName.value;

        if(groupName) {
            createGroup(groupName)
        } else {
            myAlert('danger', 'Please enter group name')
        }
    })
}
// Create group MODAL
// Close
const closeCreateModel = document.getElementById('closeCreate')
if(closeCreateModel) {
    closeCreateModel.addEventListener('click', () => {
        closeMe(closeCreateModel)
    })
}
// Show
const showCreateGroupModel = document.getElementById('showCreateGroupModel')
if(showCreateGroupModel){
    showCreateGroupModel.addEventListener('click', (e) => {
        e.preventDefault()
        showCreateGroup()
    })
}


// Member [Accept/ Remove]
const members = document.getElementById('members')
if(members){
    members.addEventListener('click', (e) => {
        const targetId = e.target.id

        if(targetId === "accept"){
            const id = e.target.getAttribute('data-id')
            acceptMember(id)
            removeChild(e.target)

        } else if(targetId === "remove") {
            const id = e.target.getAttribute('data-id')
            removeMember(id)
            removeChild(e.target)
        }

    })
}

// Quizzes [Next quiz- Remove quiz]
const quizzes = document.getElementById('quizzes')
if(quizzes){
    quizzes.addEventListener('click', (e) => {
        const targetId = e.target.id

        if(targetId === "nextQuiz"){
            const id = e.target.getAttribute('data-id')
            nextQuiz(id)

        } else if(targetId === "removeQuiz") {
            const id = e.target.getAttribute('data-id')
            removeQuiz(id, e.target)
        }

    })
}


// Finish Answering Quiz
const answerForm = document.forms['answer_form'];
if(answerForm) {
    answerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(answerForm);
        let data = [];
        for(const [key, value] of formData.entries()) {
            data.push({
                questionNumber : key,
                answer:  value
            })
        }

        finishQuiz(answerForm.getAttribute('data-id'), data)
    })
}


/*
    const getPostsFunc = () => {
        let groupid = groupFeed.getAttribute('data-id');
        groupid ? getGroupPosts(groupid, page) : getGroupPosts(false, page);


        // Load the comments of the clicked post
        groupFeed.addEventListener('click', (e) => {
            const targetId = e.target.id

            if(targetId === "postComment"){
                if(e.target.getAttribute('data-groupid')){
                    groupid = e.target.getAttribute('data-groupid')
                }
                loadComments(groupid, e.target.getAttribute('data-postId'))

            } else if (targetId === "createcommentForm") {
                const form = e.target.parentNode.parentNode;
                form.addEventListener('submit', (e) => {
                    e.preventDefault()
                    const comment = form.comment.value
                    if(comment){
                        if(form.getAttribute('data-groupId')){
                            groupid = e.target.getAttribute('data-groupId')
                        }
                        createComment(groupid, form.parentNode.getAttribute('data-postId'), comment)
                    }
                    form.comment.value = ''
                })
            }

        })
    }
*/
const groupFeed = document.getElementById('groupFeed');

// Get Posts
const loadPosts = (groupid = false) => {
    groupid ? getGroupPosts(groupid, page) : getGroupPosts(false, page);
}

const commentFunc = (e, groupid) => {
    const targetId = e.target.id

        if(targetId === "postComment"){
            if(e.target.parentNode.getAttribute('data-groupid')){
                groupid = e.target.parentNode.getAttribute('data-groupid')
            }
            loadComments(groupid, e.target.parentNode.getAttribute('data-postId'))

        } else if (targetId === "createcommentForm") {
            const form = e.target.parentNode.parentNode;
            form.addEventListener('submit', (e) => {
                e.preventDefault()
                const comment = form.comment.value
                if(comment){
                    if(form.getAttribute('data-groupId')){
                        groupid = e.target.getAttribute('data-groupId')
                    }
                    createComment(groupid, form.parentNode.getAttribute('data-postId'), comment)
                }
                form.comment.value = ''
            })
        }
}

const voteFunc = (e, groupid) => {
    const targetId = e.target.id

    if(targetId === "vote"){
        if(e.target.parentNode.getAttribute('data-groupid')){
            groupid = e.target.parentNode.getAttribute('data-groupid')
        }
        vote(groupid, e.target.parentNode.getAttribute('data-postId'))

    }
}

let page = 1;
if(groupFeed){
    let groupid = groupFeed.getAttribute('data-id');
    loadPosts(groupid)

    groupFeed.addEventListener('click', (e) => {
        commentFunc(e, groupid)
        voteFunc(e, groupid)
    })

    page++;
}

// Load More posts
const loadMore = document.getElementById('loadMore');
if(loadMore)
loadMore.addEventListener('click', () =>{
    loadMore.textContent = 'Loading...'
    let groupid = groupFeed.getAttribute('data-id');
    loadPosts(groupid)
    page++;
    loadMore.textContent = 'Load more'
})


const createPostForm = document.forms['createPostForm'];
if(createPostForm) {
    createPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const post = createPostForm.post.value;
        createPost(post)
        createPostForm.post.value = '';
    })
}
