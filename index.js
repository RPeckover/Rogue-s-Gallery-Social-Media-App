const express = require("express");
const utils=require('./utils.js')

const app = express();
app.listen(3005, () => console.log("Listening on port 3005"));

app.use(express.static("./public"));

app.use(express.json())

app.use(express.urlencoded({extended: false}))

const users=require('./users.js')

function checkLoggedIn(request, response, nextAction){
    if(true){
        nextAction()
    }
}

app.get('/app', checkLoggedIn, (request, response)=>{
    response.redirect('./application.html')
})

app.post('/register', (request, response)=>{
    console.log(users.getUsers())
    response.redirect('/registered.html')
})

app.post('/login', (request, response)=>{
    // console.log(users.getUsers())
    console.log(request.body)
    if(users.checkPassword(request.body.username, request.body.password)){
        response.redirect('/loggedin.html')
    } else {
        response.redirect('/loginfailed.html')
    }
})

app.post('/logout', (request, response)=>{
    console.log(users.getUsers())
    response.redirect('./loggedout.html')
})

app.post('/post', (request, response)=> {
    console.log(request.body)
})