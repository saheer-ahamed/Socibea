const { validateEmail, validateLength, validateUsername } = require('../helpers/validation');
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/tokens');
const { sendVerificationEmail } = require('../helpers/mailer');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/conversationModel');
const ObjectId = require('mongoose').Types.ObjectId


// user registration

exports.register = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            confirmPassword
        } = req.body

        if (!validateLength(first_name, 3, 30)) {
            return res.status(400).json({
                message: "First name must between 3 and 30 characters."
            })
        }

        if (!validateLength(last_name, 3, 30)) {
            return res.status(400).json({
                message: "Last name must between 3 and 30 characters."
            })
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid email address"
            })
        }

        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            return res.status(400).json({
                message: "Email address already exists. Try with a different one."
            })
        }

        if (!validateLength(password, 6, 60)) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters."
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Both passwords must be same."
            })
        }

        const cryptedPassword = await bcrypt.hash(password, 12)

        let tempUsername = first_name + last_name
        let newUsername = await validateUsername(tempUsername)

        const user = await new User({
            first_name,
            last_name,
            email,
            username: newUsername,
            password: cryptedPassword,
        }).save()


        const emailVerificationToken = generateToken(
            { id: user._id.toString() },
            "30m"
        )


        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
        sendVerificationEmail(user.email, user.first_name, url)

        const token = generateToken(
            { id: user._id.toString() },
            "7d"
        )

        res.send({
            id: user._id,
            username: user.username,
            firstname: user.first_name,
            lastname: user.last_name,
            picture: user.picture,
            token: token,
            verified: user.verified,
            message: "Register Success! Please activate your email to start."
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// activating account

exports.activateAccount = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const check = await User.findById(user.id)

        if (check.verified == true) {
            return res.status(400).json({ message: "This email is already activated." })
        } else {
            await User.findByIdAndUpdate(user.id, { verified: true })
            return res.status(200).json({ message: "Account has been activated successfully." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

// user login

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "The email address you entered is not connected to an Account."
            })
        }

        const check = await bcrypt.compare(password, user.password)
        if (!check) {
            return res.status(400).json({
                message: "Invalid password. Please try again"
            })
        }
        const token = generateToken(
            { id: user._id.toString() },
            "7d"
        )

        res.send({
            id: user._id,
            username: user.username,
            firstname: user.first_name,
            lastname: user.last_name,
            picture: user.picture,
            token: token,
            verified: user.verified,
            following: user.following,
            followers: user.followers,
            message: "Login Success! Please activate your email to start."
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// get a user details

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId
    try {
        const user = await User.aggregate([
            { $match: { _id: ObjectId(userId) } },
            { $project: { password: 0 } }
        ])
        res.status(200).json(user[0])
    } catch (error) {
        res.status(500).json(error)
    }
}

// get users details

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// get details of my followings and non-followings

exports.getOtherUsers = async (req, res, next) => {
    const userId = req.params.id
    try {
        const friendsPromise = User.aggregate([
            {
                '$match': {
                    '_id': {
                        '$ne': ObjectId(userId)
                    }
                }
            }, {
                '$match': {
                    'followers': {
                        '$in': [
                            userId
                        ]
                    }
                }
            }
        ])

        const notFriendsPromise = User.aggregate([
            {
                '$match': {
                    '_id': {
                        '$ne': ObjectId(userId)
                    }
                }
            }, {
                '$match': {
                    'followers': {
                        '$nin': [
                            userId
                        ]
                    }
                }
            }
        ])

        const [myFollowings, notMyFollowings] = await Promise.all([
            friendsPromise, notFriendsPromise
        ])

        res.status(200).json({ myFollowings, notMyFollowings })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Follow/unfollow a user

exports.handleFollow = async (req, res, next) => {
    const id = req.params.id

    const { userId } = req.body

    if (userId === id) {
        res.status(403).json("Action forbidden.")
    } else {
        try {
            const followUser = await User.findById(id)
            const followingUser = await User.findById(userId)

            if (!followUser.followers.includes(userId)) {
                await followUser.updateOne({ $push: { followers: userId } })
                await followingUser.updateOne({ $push: { following: id } })

                const conversation = await Conversation.find({
                    members: { $all: [userId, id] }
                })


                if (conversation.length === 0) {
                    const newConversation = new Conversation({
                        members: [userId, id]
                    })

                    const savedConversation = await newConversation.save()
                }

                res.status(200).json(followUser._doc)
            } else {
                await followUser.updateOne({ $pull: { followers: userId } })
                await followingUser.updateOne({ $pull: { following: id } })
                res.status(403).json(followUser._doc)
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
}