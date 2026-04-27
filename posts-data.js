const mongoose=require('mongoose');
const {Schema, model} = mongoose;

const postSchema = new Schema({
    postedBy: String,
    message: String,
    imagePath: String,
    likes: Number,
    time: Date,
    comments: [
        {
            message: String,
            commentBy: String,
            likes: Number
        }
    ]
});

const Posts = model('Post', postSchema);

function addNewPost(userID, post, imageFilename){
    let myPost={
        postedBy: userID,
        message: post.message,
        imagePath: imageFilename,
        likes: 0,
        time: Date.now(),
        comments: []
    }
    Posts.create(myPost)
        .catch(err=>{
            console.log("Error: "+err)
        })
    // posts.unshift(myPost)
}

async function getPosts(n=3){
    let data=[]
    await Posts.find({})
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
    await Posts.findOne({_id:postID})
        .exec()
        .then(mongoData=>{
            foundPost=mongoData
        })
    return foundPost
}

async function likePost(postID){
    await Posts.findOneAndUpdate({_id:postID}, {$inc: {likes: 1}})
    //Mongoose method for modifying and incrementing data
        .exec()
}

async function commentOnPost(postID, commentText, commentBy){
    let newComment={
        message: commentText,
        commentBy: commentBy,
        likes: 0
    }
    await Posts.findOneAndUpdate({_id:postID}, {$push: {comments: newComment}})
        .exec()
}

module.exports={addNewPost, getPosts, getPost, likePost, commentOnPost}
