let loggedInUsers;

function pageLoadHandler() {
    console.log(localStorage);
    // checking for all local storage
    // let getLoggedInUsersFromLocalStorage = JSON.parse(localStorage.getItem('loggedInUser'));
    // let loggedInUsers = getLoggedInUsersFromLocalStorage ? getLoggedInUsersFromLocalStorage : [];

    // if(getLoggedInUsersFromLocalStorage == null){
    //     // redirect to welcome page
    //     location.href = 'welcome.html';
    // } else{
    //     loggedInUsers = getLoggedInUsersFromLocalStorage.email;
    // }

}

function isUserLoggedIn() {
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
    let getUsersFromLocalStorage = JSON.parse(localStorage.getItem('usersLS'));
    let users = getUsersFromLocalStorage ? getUsersFromLocalStorage : [];

    let fullName = document.forms["registerForm"]["fullName"].value;
    let email = document.forms["registerForm"]["email"].value;
    let password = document.forms["registerForm"]["password"].value;
    let confirmPassword = document.forms["registerForm"]["confirmPassword"].value;
    // console.log(fullName, email, password, confirmPassword);

    if (fullName == "") {
        alert("Enter your Name!");
        return false;
    } else if (email == "") {
        alert("Enter your Email!");
        return false;
    } else if (password == "") {
        alert("Enter your Password!");
        return false;
    } else if (confirmPassword == "") {
        alert("Enter Confirm Password!");
        return false;
    } else if (password !== confirmPassword) {
        alert("Both password should match!");
        return false;
    } else if (!isEmailValid) { // invalid email
        alert("Enter valid email id!");
        return false;
    } else { // If entered is valid
        userRegisterDetails = {
            id: Number(new Date()), // Epoch as unique ID
            fullName: fullName,
            email: email,
            password: password
        }
        if (users.length == 0) {
            // handling first user
            users.push(userRegisterDetails);
            localStorage.setItem('usersLS', JSON.stringify(users));
            // user will be redirected to register successful page
            return true;
        } else {
            // checking for existing record
            let isUserExist = false;
            for (let i = 0; i < users.length; i++) {
                console.log(users[i].email == email);
                if (users[i].email == email) {
                    console.log("Email - ", users[i].email);
                    isUserExist = true;
                    break; // user is found
                }
            }
            if (isUserExist) {
                //alert
                alert("This email/user already exists!");
                return false;
            } else {
                // save user
                users.push(userRegisterDetails);
                localStorage.setItem('usersLS', JSON.stringify(users));
                // user will be redirected to register successful page
                return true;
            }
        }
    }
}