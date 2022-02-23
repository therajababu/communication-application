

function pageLoadHandler(){
    // checking for all local storage
    let getUsersFromLocalStorage = JSON.parse(localStorage.getItem('usersLS'));
    let users = getUsersFromLocalStorage ? getUsersFromLocalStorage : [];
}

function isUserLoggedIn(){
    alert("Checking!")
}

function isEmailValid(email) {
    let aPos = email.indexOf("@");
    let dotPos = email.lastIndexOf(".");
    
    if (aPos < 1 || dotPos - aPos < 2) {
        return false;
    } else {
        return true;
    }
}

function onLoginSubmitHandler() {
    let email = document.forms["loginForm"]["email"].value;
    let password = document.forms["loginForm"]["password"].value;
    // console.log(email, password);

    if (email == "" && password == "") {
        alert("Enter your Email & Password!");
        return false;
    } else if (email == "") {
        alert("Enter your Email!");
        return false;
    } else if (password == "") {
        alert("Enter your Password!");
        return false;
    } else if (!isEmailValid) { // invalid email
        alert("Enter a valid email id!");
        return false;
    } else { // everything is valid
        return true;
    }
}

function validateRegisterFormSubmitHandler() {
    // Getting user data
    // let getUsersFromLS = JSON.parse(localStorage.getItem('usersLS'));
    // let users = getUsersFromLS ? getUsersFromLS : [];

    let fullName = document.forms["registerForm"]["fullName"].value;
    let email = document.forms["registerForm"]["email"].value;
    let password = document.forms["registerForm"]["password"].value;
    let confirmPassword = document.forms["registerForm"]["confirmPassword"].value;
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