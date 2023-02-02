const express = require('express')
const { createPost, getPost, updatePost, deletePost, likePost, getTimelinePosts, savePost, getSavedPosts, commentPost, getPostComments, deleteComment, editComment, getUserPosts } = require('../controllers/postController.js')

const router = express.Router()

router.post('/post', createPost)
router.route('/:id').get(getPost).put(updatePost).delete(deletePost)
router.put('/:id/like', likePost)
router.put('/:id/save', savePost)
router.get('/:id/timeline', getTimelinePosts)
router.get('/:id/savedPosts', getSavedPosts)
router.get('/:id/userPosts', getUserPosts)
router.route('/:id/comment').put(commentPost).get(getPostComments)
router.put('/:id/deleteComment', deleteComment)
router.put('/:id/editComment', editComment)

module.exports = router