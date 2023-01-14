const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        text: true
    },
    last_name: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        text: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        text: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    picture: {
        type: String,
        trim: true,
        default: ""
    },
    cover: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    bYear: {
        type: Number,
        trim: true
    },
    bMonth: {
        type: Number,
        trim: true
    },
    bDay: {
        type: Number,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    friends: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    requests: {
        type: Array,
        default: []
    },
    search: [
        {
            user: {
                type: ObjectId,
                ref: 'User'
            }
        }
    ],
    details: {
        bio: {
            type: String
        },
        otherName: {
            type: String
        },
        job: {
            type: String
        },
        workplace: {
            type: String
        },
        highSchool: {
            type: String
        },
        college: {
            type: String
        },
        currentCity: {
            type: String
        },
        hometown: {
            type: String
        },
        relationship: {
            type: String,
            enum: ['Single','In a relationship','Married']
        },
        instagram: {
            type: String
        },
    },
    savedPosts: []
},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)