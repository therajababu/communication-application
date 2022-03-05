// Global variable

let LOGGED_IN_USER = [];
let EDIT_USER_ID = "";

function readFromLocalStorage(key) {
    // Getting data from local storage
    let getFromLocalStorage = JSON.parse(localStorage.getItem(key));
    let data = getFromLocalStorage ? getFromLocalStorage : [];
    return data; // returning array of object
}

function saveToLocalStorage(key, value) {
    // key is string and values is array of objects
    localStorage.setItem(key, JSON.stringify(value));
    // returns nothing
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

function loggedInUser() {
    // checking the local storage
    let getLoggedInUsersFromLocalStorage = JSON.parse(localStorage.getItem('loggedInUserLS'));
    // updating gloabl variable
    LOGGED_IN_USER = getLoggedInUsersFromLocalStorage ? getLoggedInUsersFromLocalStorage : [];
}

function pageLoadHandler() {
    loggedInUser();

    if (LOGGED_IN_USER.length == 0) { // no user is stored
        // redirect to welcome page
        location.href = 'welcome.html';
    } else {
        // do nothing
    }
}


// User Management Page

function userManagementPageLoadHandler() {
    let users = readFromLocalStorage("usersLS");
    console.log(users);
    var tableBody = document.getElementById("user-list-table-body");

    let rowsToInsert;

    for (let i = 0; i < users.length; i++) {
        rowData = `<tr>
            <td>${users[i].fullName}</td>
            <td class="text-center">${users[i].email}</td>
            <td class="text-center">
                <a href="edit-users.html?editUserID=${users[i].id}"><button type="button" id="${users[i].id}" class="btn ">Edit</button></a> |
                <button type="button" id="${users[i].id}" class="btn" data-bs-toggle="modal" data-bs-target="#deleteUserModal">
                    Delete</button>
            </td>
        </tr>`;
        console.log(rowsToInsert);
        var newRow = document.getElementById("user-list-table-body").insertRow();
        newRow.innerHTML = rowData;
    }
}

function editUserPageLoadHandler() {
    let url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (let i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }

    let users = readFromLocalStorage("usersLS");
    let editUserID = data["editUserID"];

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == editUserID) {

            EDIT_USER_ID = users[i]["id"];
            // displaying the record
            document.getElementById("fullName").value = users[i]["fullName"];
            document.getElementById("email").value = users[i]["email"];
            break; // user is found
        }
    }
}

function editUserFormSubmitHandler() {
    // geting users data from local storage
    let users = readFromLocalStorage("usersLS");
    // getting updated details
    let newFullName = document.forms["editUserForm"]["fullName"].value
    let newEmail = document.forms["editUserForm"]["email"].value

    // updating user data and saving
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == EDIT_USER_ID) {
            users[i].fullName = newFullName;
            users[i].email = newEmail;
            // console.log("Edit User : ", users[i]);
            saveToLocalStorage("usersLS", users);
            return true; // user data is saved and redirecting to user management
        }
    }
    return false; // user not found 
}


// Group Chat Page

function prepareMessageToDisplay(msg) {
    let thisMsg = "[" + msg.timestamp + "] " + msg.fullName + " : " + msg.msg + "<br>";
    return thisMsg;
}

function readPreviousMessages() {
    // Getting old messages
    let getMessagesFromLocalStorage = JSON.parse(localStorage.getItem('msgsLS'));
    let msgs = getMessagesFromLocalStorage ? getMessagesFromLocalStorage : [];
    return msgs;
}

function groupChatPageLoadHandler() {
    pageLoadHandler();

    // checking for old messages
    let msgs = readPreviousMessages();
    if (msgs.length == 0) {
        // displaying default chat window
        document.getElementById("group-chat-messages").innerHTML = "";
    } else {
        for (let i = 0; i < msgs.length; i++) {
            let thisMsg = prepareMessageToDisplay(msgs[i]);
            document.getElementById("group-chat-messages").innerHTML += thisMsg;
        }
    }
    // displaying current user full name
    document.getElementById("user-full-name").innerHTML = LOGGED_IN_USER.fullName;
}

function sendMessageGroupChat() {
    // get previous messages from local storage
    let messages = readPreviousMessages();
    // get current message
    let newMessage = document.getElementById("msg-input-group-chat").value;
    // checking for blank message
    if (newMessage.trim() !== "") { // if msg is not blank
        // appending new msg to previous msg and displaying
        let msgObj = {
            id: "M" + Number(new Date()),
            timestamp: new Date().toLocaleString(),
            userID: LOGGED_IN_USER.id,
            fullName: LOGGED_IN_USER.fullName,
            msg: newMessage.trim()
        }

        document.getElementById("group-chat-messages").innerHTML += prepareMessageToDisplay(msgObj);
        // removing message from input box
        document.getElementById("msg-input-group-chat").value = "";

        // saving msgs to local storage
        messages.push(msgObj);
        localStorage.setItem('msgsLS', JSON.stringify(messages));
    }
}

function refeshMessagesGroupChat() {
    // deleating and reinitializing the msgs local storage
    localStorage.removeItem("msgsLS");
    localStorage.setItem('msgsLS', JSON.stringify([]));
    document.getElementById("group-chat-messages").innerHTML = "";
}


// Login Page

function loginPageLoadHandler() {
    loggedInUser();

    if (LOGGED_IN_USER.length !== 0) {
        // If any user is already logged in
        location.href = "login-successful.html";
    }
}

function onLoginSubmitHandler() {
    // Checking logged in user bacause
    // when login page loads, it doesn't call pageLoadHandler() 
    loggedInUser();

    // Getting user data
    let getUsersFromLocalStorage = JSON.parse(localStorage.getItem('usersLS'));
    let users = getUsersFromLocalStorage ? getUsersFromLocalStorage : [];

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
        // checking for email and password
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email && users[i].password == password) {
                // user is found in database
                // updating global variable
                LOGGED_IN_USER = users[i];
                // saving to local storage
                localStorage.setItem('loggedInUserLS', JSON.stringify(LOGGED_IN_USER));
                // allow to be redirected to login successful page
                return true;
            }
        }
        // user dont exist
        alert("Enter correct email & password!");
        return false;
    }
}

function loginSuccessfulPageLoadHandler() {
    pageLoadHandler();
    // updating username on page
    document.getElementById("user-email").innerHTML = LOGGED_IN_USER.email;
}

// Registration Page

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
            id: "U" + Number(new Date()), // Epoch as unique ID
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
                if (users[i].email == email) {
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

// Logout Page

function logoutUser() {
    localStorage.removeItem("loggedInUserLS");
    localStorage.setItem('loggedInUserLS', JSON.stringify([]));
    LOGGED_IN_USER = [];
    location.href = "logout.html";
}

// Welcome Page

function welcomePageLoadHandler() {
    // if any user is logged in
    // then redirect to login successful page
    // else do nothing - let them login or register
    let user = readFromLocalStorage("loggedInUserLS");
    if (user.length !== 0) {
        location.href = "login-successful.html";
    }
}