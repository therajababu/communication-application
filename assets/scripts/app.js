function isEmailValid(email) {
    var aPos = email.indexOf("@");
    var dotPos = email.lastIndexOf(".");

    if (aPos < 1 || dotPos - aPos < 2) {
        return false;
    } else {
        return true;
    }
}


function onLoginSubmitHandler() {

    var email = document.forms["loginForm"]["email"].value;
    var password = document.forms["loginForm"]["password"].value;

    // console.log(email);
    // console.log(password);

    if (email == "" && password == "") {
        alert("Email & Password can't be blank, must be filled out!");
        return false;
    } else if (email == "") {
        alert("Email can't be blank, must be filled out!");
        return false;
    } else if (password == "") {
        alert("Password can't be blank, must be filled out!");
        return false;
    } else if (email != "") {

        var aPos = email.indexOf("@");
        var dotPos = email.lastIndexOf(".");

        if (aPos < 1 || dotPos - aPos < 2) {
            alert("Please enter valid email id!");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function validateRegisterFormSubmitHandler() {
    // Getting user data
    var getUsersFromLS = JSON.parse(localStorage.getItem('usersLS'));
    var users = getUsersFromLS ? getUsersFromLS : [];

    var fullName = document.forms["registerForm"]["fullName"].value;
    var email = document.forms["registerForm"]["email"].value;
    var password = document.forms["registerForm"]["password"].value;
    var confirmPassword = document.forms["registerForm"]["confirmPassword"].value;
    // console.log(fullName, email, password, confirmPassword);

    if (fullName == "") {
        alert("Please enter your Name!");
        return false;
    } else if (email == "") {
        alert("Please enter your Email!");
        return false;
    } else if (password == "") {
        alert("Please enter your Password!");
        return false;
    } else if (confirmPassword == "") {
        alert("Please enter Confirm Password!");
        return false;
    } else if (password !== confirmPassword) {
        alert("Both password should match!");
        return false;
    } else if (!isEmailValid) { // invalid email
        alert("Please enter valid email id!");
        return false;
    } else { // If everything is valid
        // Stroring the user into Local Storage
        userRegisterDetails = {
            id: Number(new Date()), // Epoch 
            fullName: fullName,
            email: email,
            password: password
        }
        users.push(userRegisterDetails);
        localStorage.setItem('usersLS', JSON.stringify(users));

        return true;
    }
}