import express from 'express'
import { createSocialPost, getSocialPosts, likePost, sharePost, addComment,deletePost } from '../controllers/social.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/create', auth, createSocialPost);
router.get('/get', getSocialPosts)
router.patch('/like/:id', auth, likePost)
router.patch('/share/:id', auth, sharePost)
router.post('/comment/:id', auth, addComment)
router.delete('/delete/:id', auth, deletePost)

export default router