// function to allow user to delete profile and all posts
async function eraseUser() {
  if (document.querySelector('#eraseTickbox').checked) {// checks the tickbox has been selected, confirming intent to erase the account
    //ADD for loop going through posts, deleting them
    window.alert("account deleted.");
    //ADD delete user
    request.session.destroy();
    response.render("pages/register");// sends user back to register page
} else {
    window.alert("please also tick the checkbox if you would like to erase your account");// alerts user that they must use the tickbox to reset their progress
}
}

async function erasePost() {
  // use 'get one and update'?
}

function textCounter( field, countfield, maxlimit ) {
   if ( field.value.length > maxlimit ) {
    field.value = field.value.substring( 0, maxlimit );
    field.blur();
    field.focus();
    return false;
   } else {
    countfield.value = maxlimit - field.value.length;
   }
}

// use app.locals?