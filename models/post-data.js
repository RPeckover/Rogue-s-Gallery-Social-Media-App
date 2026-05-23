const mongoose=require('mongoose')
const {Schema, model} = mongoose

const postSchema = new Schema({
    postedBy: String,
    message: String,
    imagePath: String, // SEE HOW TO MAKE THIS THE AVATAR ATTATCHED TO USER SCHEMA
    likes: Number,
    time: Date,
    comments: [
        {
            message: String,
            commentBy: String,
            likes: Number
            // Could I make 'likes' another nested data structure to error handle / prevent a user liking a post multiple times?
        }
    ]
})

const Post = model('Post', postSchema)

function addNewPost(userID, post, myPFP){
    let myPost={
        postedBy: userID,
        message: post.message,
        imagePath: myPFP, // SEE HOW TO MAKE THIS THE AVATAR ATTATCHED TO USER SCHEMA
        likes: 0,
        time: Date.now(),
        comments: []
    }
    Post.create(myPost)
        .catch(err=>{
            console.log("Error: "+err)
        })
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
}

async function getPost(postID){
    let foundPost=null
    await Post.findOne({_id:postID})
        .exec()
        .then(mongoData=>{
            foundPost=mongoData
        })
    return foundPost
}

async function likePost(postID){
    // let foundPost=null  
    await Post.findOneAndUpdate({_id:postID}, {$inc: {likes: 1}})
        .exec()
    //     .then(mongoData=>{
    //         foundPost=mongoData
    //     })
    // return foundPost
}
//Confused by this ^

async function commentOnPost(postID, commentText, commentBy){
    let newComment={
        message: commentText,
        commentBy: commentBy,
        likes: 0
    }
    await Post.findOneAndUpdate({_id:postID}, {$push: {comments: newComment}})
        .exec()
}

module.exports={
    addNewPost,
    getPosts,
    getPost,
    likePost,
    commentOnPost
}