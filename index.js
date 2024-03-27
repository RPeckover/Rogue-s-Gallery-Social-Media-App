const express = require("express");

const app = express();
app.listen(3005, () => console.log("Listening on port 3005"));

app.use(express.static("./public"));

app.use(express.urlencoded({extended: false}))

app.post('/login', (request, response) => {
    console.log(request.body)
    response.redirect('loggedin.html')
})

app.post('/post', (request, response)=> {
    console.log(request.body)
})