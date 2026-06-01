const mongoose=require('mongoose')
const {Schema, model} = mongoose

const postSchema = new Schema({
    postedBy: String,
    message: String,
    authorAvatar: String, 
    // ^ see how to make this the avatar attached to user schema
    likes: Number,
    time: Date,
    comments: [
        {
            message: String,
            commentBy: String,
            likes: Number
            // likes and comments on other comments currently disabled
            // make 'likes' another nested data structure to error handle / prevent a user liking a post multiple times?
        }
    ]   
    // likes: [
    //      {
    //      likeNum: Number,
    //      likedBy: [],
    //      }
    // ]
})

const Post = model('Post', postSchema)

function addNewPost(userID, post, myPFP){
    let myPost={
        postedBy: userID,
        message: post.message,
        imagePath: myPFP, 
        // ^ see how to make this the avatar attached to user schema
        likes: 0,
        time: Date.now(),
        comments: []
    }
    Post.create(myPost)
        .catch(err=>{
            console.log("Error: "+err)
        })
    // prevents invalid data being input to the database
}

async function getPosts(n=3){
    let data=[]
    await Post.find({})
        .sort({'time': -1})
        .limit(n)
        .exec()
        .then(mongoData=>{
            data=mongoData
        })
    return data
    // returns posts chronologically from most recent to oldest
}

async function getPost(postID){
    let foundPost=null
    await Post.findOne({_id:postID})
        .exec()
        .then(mongoData=>{
            foundPost=mongoData
        })
    return foundPost
    // locates specific posts by ID
}

async function likePost(postID){
    // let foundPost=null  
    await Post.findOneAndUpdate({_id:postID}, {$inc: {likes: 1}})
        .exec()
    //     .then(mongoData=>{
    //         foundPost=mongoData
    //     })
    // return foundPost
    // increments 'like' value on post 
}

async function commentOnPost(postID, commentText, commentBy){
    let newComment={
        message: commentText,
        commentBy: commentBy,
        likes: 0
    }
    await Post.findOneAndUpdate({_id:postID}, {$push: {comments: newComment}})
        .exec()
    // appends comment to the relevent post
}

module.exports={
    addNewPost,
    getPosts,
    getPost,
    likePost,
    commentOnPost
}
// exports functions for use elsewhere