const express = require('express')
const { register, activateAccount, login, getUsers, getOtherUsers, handleFollow, getUser, updateProfile, updateCover } = require('../controllers/userController')
const { authUser, auth } = require('../middlewares/auth')

const router = express.Router()

router.post('/register', register)
router.post('/activate', activateAccount)
router.post('/login', login)
router.get('/user/:userId', getUser)
router.get('/users', getUsers)
router.get('/:id/otherUsers', getOtherUsers)
router.put('/:id/handleFollow', handleFollow)
router.put('/:id/updateProfile', updateProfile)
router.put('/:id/updateCover', updateCover)
// router.get('/error', error)
router.post('/auth', authUser, auth)

module.exports = router