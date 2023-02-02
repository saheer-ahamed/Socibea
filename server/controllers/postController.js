const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const ObjectId = require('mongoose').Types.ObjectId


// Create new Post
exports.createPost = async (req, res, next) => {
    try {
        const newPost = await new Post(req.body).save()
        const newPostUser = await User.findOne({ _id: ObjectId(newPost.userId) })
        const { first_name, last_name, username, picture } = newPostUser
        const totalPost = { ...newPost._doc, first_name, last_name, username, picture }

        res.status(200).json(totalPost)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a post

exports.getPost = async (req, res, next) => {
    const id = req.params.id

    try {
        const post = await Post.findById(id)
        res.status(200).json(post)

    } catch (error) {
        res.status(500).json(error)
    }
}

// update a post

exports.updatePost = async (req, res, next) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await Post.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post Updated")
        } else {
            res.status(403).json("Action Forbidden")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// delete a post

exports.deletePost = async (req, res, next) => {
    const id = req.params.id
    const { userId } = req.body

    try {
        const post = await Post.findById(id)
        if (post.userId === userId) {
            await Post.updateOne({ _id: id }, { $set: { "deleted": true } })
            res.status(200).json("Post deleted successfully!")
        } else {
            res.status(403).json("Action Forbidden")
        }

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

// like or dislike a post

exports.likePost = async (req, res, next) => {
    const id = req.params.id
    const { userId } = req.body

    try {

        const post = await Post.findById(id)
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json("Post Liked")
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json("Post unliked")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// save or unsave a post

exports.savePost = async (req, res, next) => {
    const id = req.params.id
    const { userId } = req.body

    try {
        const user = await User.findById(userId)
        const post = await Post.findById(id)
        if (!user.savedPosts.some(obj => obj.post === id) && !post.savedBy.includes(userId)) {
            await user.updateOne({ $push: { savedPosts: id } })
            await post.updateOne({ $push: { savedBy: userId } })
            res.status(200).json("Post Bookmarked!")
        } else {
            await user.updateOne({ $pull: { savedPosts: id } })
            await post.updateOne({ $pull: { savedBy: userId } })
            res.status(200).json("Bookmark removed.")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// get Timeline posts

exports.getTimelinePosts = async (req, res, next) => {
    const userId = req.params.id

    try {
        const timelinePosts = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                $addFields: {
                    stringId: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "stringId",
                    foreignField: "userId",
                    as: "myPosts"
                }
            },
            {
                $project: {
                    _id: 0,
                    allPosts: {
                        $concatArrays: ["$followingPosts", "$myPosts"],
                    }
                }
            },
            {
                $unwind: {
                    path: "$allPosts"
                }
            },
            {
                $match: { "allPosts.deleted": false }
            },
            {
                $addFields: {
                    objId: { $toObjectId: "$allPosts.userId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "objId",
                    foreignField: "_id",
                    as: "userDatas",
                    'pipeline': [
                        {
                            '$project': {
                                'first_name': 1,
                                'last_name': 1,
                                'picture': 1,
                                'username': 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$userDatas"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$userDatas', '$allPosts']
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        res.status(200).json(timelinePosts)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get saved posts

exports.getSavedPosts = async (req, res, next) => {
    const userId = req.params.id

    try {

        const userSavedPosts = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                $addFields: {
                    objectIds: {
                        $map: {
                            input: "$savedPosts",
                            as: "savedPostId",
                            in: { $toObjectId: "$$savedPostId" }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'objectIds',
                    foreignField: '_id',
                    as: 'savedPostData'
                }
            },
            {
                $project: {
                    savedPostData: 1,
                    _id: 0
                }
            },
            {
                $unwind: {
                    path: "$savedPostData"
                }
            },
            {
                $match: { "savedPostData.deleted": false }
            },
            {
                $addFields: {
                    objIds: { $toObjectId: "$savedPostData.userId" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'objIds',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: '$userData'
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$userData', '$savedPostData']
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
        res.status(200).json(userSavedPosts)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get each user posts

exports.getUserPosts = async (req, res, next) => {
    const userId = req.params.id
    try {
        const userPosts = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                $addFields: {
                    stringUserId: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'stringUserId',
                    foreignField: 'userId',
                    as: 'userPosts'
                }
            },
            {
                $project: {
                    userPosts: 1,
                    username: 1,
                    first_name: 1,
                    last_name: 1,
                    picture: 1,
                    _id: 0
                }
            },
            {
                $unwind: {
                    path: "$userPosts"
                }
            },
            {
                $match: { "userPosts.deleted": false }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$userPosts', '$$ROOT']
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
        res.status(200).json(userPosts)
    } catch (error) {
        res.status(500).json(error)
    }
}

// comment a post

exports.commentPost = async (req, res, next) => {
    const postId = req.params.id
    const { userId, comment } = req.body
    try {
        const newComment = await new Comment({ comments: comment, userId, postId }).save()
        const newCommentUser = await User.findOne({ _id: ObjectId(newComment.userId) })
        const { first_name, last_name, username, picture } = newCommentUser
        const wholeComment = { ...newComment._doc, userData: { first_name, last_name, username, picture } }

        res.status(200).json(wholeComment)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get comments of a post

exports.getPostComments = async (req, res, next) => {
    const postId = req.params.id
    try {
        const comments = await Comment.aggregate([
            {
                '$match': {
                    'postId': postId,
                    'deleted': { '$ne': true }
                }
            }, {
                '$addFields': {
                    'userObjId': {
                        '$toObjectId': '$userId'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userObjId',
                    'foreignField': '_id',
                    'as': 'userData',
                    'pipeline': [
                        {
                            '$project': {
                                'first_name': 1,
                                'last_name': 1,
                                'picture': 1,
                                'username': 1
                            }
                        }
                    ]
                }
            }, {
                '$unwind': {
                    'path': '$userData'
                }
            },
            {
                $project: {
                    userObjId: 0
                }
            }
        ])
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete comments (soft delete)

exports.deleteComment = async (req, res, next) => {
    const commentId = req.params.id
    const { userId } = req.body
    try {
        const findComment = await Comment.findById(commentId)
        if (findComment.userId !== userId) {
            res.status(200).json({ message: 'You are not authorized.' })
        } else {
            await Comment.findByIdAndUpdate(commentId, { deleted: true })
            res.status(200).json({ message: "Comment deleted." })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// edit comment of post

exports.editComment = async (req, res, next) => {
    const commentId = req.params.id
    const { userId, newComment } = req.body
    try {
        const findComment = await Comment.findById(commentId)
        if (findComment.userId !== userId) {
            res.status(200).json({ message: 'You are not authorized.' })
        } else {
            await Comment.findByIdAndUpdate(commentId, { comments: newComment, edited: true })
            const editedComment = await Comment.findById(commentId)
            const editedCommentUser = await User.findOne({ _id: ObjectId(editedComment.userId) })
            const { first_name, last_name, username, picture } = editedCommentUser
            const wholeEditedComment = { ...editedComment._doc, userData: { first_name, last_name, username, picture } }

            res.status(200).json(wholeEditedComment)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


