const mongoose=require('mongoose');
const {Schema, model} = mongoose;

const postSchema = new Schema({
    postedBy: String,
    //prompt: String,
    message: String,
    imagePath: String,
    likes: Number,
    time: Date,
    comments: [
        {
            commentBy: String,
            //commentPrompt: String,
            // ^ perhaps workshop a better name 
            message: String,
            likes: Number
        }
    ]
});

const Posts = model('Post', postSchema);

function addNewPost(userID, post, imageFilename){
    let myPost={
        postedBy: userID,
        //prompt: currentPrompt,
        message: post.message,
        imagePath: imageFilename,
        likes: 0,
        time: Date.now(),
        comments: []
    }
    Posts.create(myPost)
        .catch(err=>{
            console.log("Error: "+err)
            // add in 'error.png' as part of a popover / callout as user feedback?
        })
    // posts.unshift(myPost)
}
// NOTE - CURRENTLY USER CAN LIKE A POST MULTIPLE TIMES BY REFRESHING THE PAGE OR LOGGING OUT AND IN
// add user PFP to posts

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

// like functionality
async function likePost(postID){
    await Posts.findOneAndUpdate({_id:postID}, {$inc: {likes: 1}})
    //Mongoose method for modifying and incrementing data
        .exec()
}
// UPDATE THIS TO PREVENT USER FROM BEING ABLE TO INCREMENT LIKES INFINITLEY

async function commentOnPost(postID, commentText, commentBy){
    let newComment={
        commentBy: commentBy,
        //prompt: currentPrompt,
        message: commentText,
        likes: 0
    }
    await Posts.findOneAndUpdate({_id:postID}, {$push: {comments: newComment}})
        .exec()
}

module.exports={addNewPost, getPosts, getPost, likePost, commentOnPost}
