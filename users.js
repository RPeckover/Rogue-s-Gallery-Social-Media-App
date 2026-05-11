const users=[
    {username:'user1', password:'123', loggedin:false},
    {username:'user2', password:'123', loggedin:false}
]
// ^ this updates to include new users

function newUser(username, password){
    const user={username:username, password:password, loggedin:false}
    users.push(user)
}

function getUsers(){
    return users
}
// check over this - this may only be needed for testing currently

function findUser(username){
    return users.find(user=>user.username==username)
}

function checkPassword(username, password){
    let user=findUser(username)
    if(user){
        return user.password==password
    }
    return false
}

function setLoggedIn(username, state){
    let user=findUser(username)
    if(user){
        user.loggedin=state
    }
}

function isLoggedIn(username){
    let user=findUser(username)
    if(user){
        return user.loggedin=state
    }
    return false
}

exports.newUser=newUser;
exports.getUsers=getUsers;
exports.findUser=findUser;
exports.checkPassword=checkPassword;
exports.setLoggedIn=setLoggedIn;
exports.isLoggedIn=isLoggedIn;