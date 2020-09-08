const express = require('express')
const router = new express.Router


const {protect} = require('../controllers/authController')
const {restrictToInGroup} = require('../controllers/groupController');
const {doesPostExist,getAllPosts, getPost, createPost, updatePost, deletePost, loadComments, createComment, updateComment, deleteComment, vote} = require('../controllers/postController')

router.use(protect)

// Get All Posts in the group
router.post('/posts', getAllPosts)

// Get All Posts in the group
router.route('/:groupid/posts')
.post(restrictToInGroup('admin', 'member'), getAllPosts)


router.route('/:groupid/newpost')
.post(restrictToInGroup('admin', 'member'), createPost)

router.route('/:groupid/post/:postId')        
        .get(restrictToInGroup('admin', 'member'), getPost)
        .patch(restrictToInGroup('admin', 'member'), updatePost)
        .delete(restrictToInGroup('admin', 'member'), deletePost)


// Comment routes
router.route('/:groupid/post/:postId/comment')        
        .post(restrictToInGroup('admin', 'member'), doesPostExist, createComment)
        .get(restrictToInGroup('admin', 'member'), doesPostExist, loadComments)

router.route('/:groupid/post/:postId/comment/:commentId')        
        .patch(restrictToInGroup('admin', 'member'), doesPostExist, updateComment)
        .delete(restrictToInGroup('admin', 'member'), doesPostExist, deleteComment)

router.route('/:groupid/post/:postId/vote')        
        .post(restrictToInGroup('admin', 'member'), doesPostExist, vote)

module.exports = router