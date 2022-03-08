// Global variable

let LOGGED_IN_USER = [];
let LOGGED_IN_USER_ID;
let EDIT_USER_ID = "";
let DELETE_USER_ID;
let DELETE_UPLOADED_DOC_ID; // stores doc id
let DELETE_SHARED_DOC_ID; // stores shared id
let EDIT_UPLOADED_DOC_ID; // edit doc by id

function getUserById(id) {
    let users = readFromLocalStorage("users");
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            let user = users[i];
            // deleting password
            delete user.password;
            return user;
        }
    }
}

function getDocById(id) {
    let docs = readFromLocalStorage("docs");
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].id == id) {
            return docs[i];
        }
    }
}

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
    let getLoggedInUsersFromLocalStorage = JSON.parse(localStorage.getItem('loggedInUser'));
    // updating gloabl variable
    LOGGED_IN_USER = getLoggedInUsersFromLocalStorage ? getLoggedInUsersFromLocalStorage : [];
    LOGGED_IN_USER_ID = LOGGED_IN_USER.id;
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

// Manage Documents

function manageDocumentsPageLoadHandler() {
    pageLoadHandler();

    // Display My Uploads section
    let docs = readFromLocalStorage("docs");
    var tableBodyMyUploads = document.getElementById("my-uploads-list-table-body");
    tableBodyMyUploads.innerHTML = ""; // clear previous data
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].addedByUserId == LOGGED_IN_USER_ID) {
            rowData = `<tr>
                    <td>${docs[i].label}</td>
                    <td class="text-center">${docs[i].fileName}</td>
                    <td class="text-center">
                        <button type="button" id="${docs[i].id}" onclick="docEditBtn(this)" class="btn" data-bs-toggle="modal"
                            data-bs-target="#editDocumentModal">
                            Edit
                        </button> |
                        <button type="button" id="${docs[i].id}" onclick="docDeleteBtn(this)" class="btn" data-bs-toggle="modal"
                            data-bs-target="#deleteDocumentModal">
                            Delete
                        </button> |
                        <a href="share.html?shareDocId=${docs[i].id}"><button type="button" class="btn ">Share</button></a>
                    </td>
                </tr>`;
            // inserting row 
            var newRow = tableBodyMyUploads.insertRow();
            // updating row data
            newRow.innerHTML = rowData;
        }
    }

    // Display Shared With me Section
    let sharedDocs = readFromLocalStorage("sharedDocs");
    var tableBodySharedUploads = document.getElementById("shared-uploads-list-table-body");
    for (let i = 0; i < sharedDocs.length; i++) {
        if (sharedDocs[i].sharedToUserId == LOGGED_IN_USER_ID) {
            rowData = `<tr>
                <td>${getDocById(sharedDocs[i].docId).label}</td>
                <td class="text-center">${getDocById(sharedDocs[i].docId).fileName}</td>
                <td class="text-center">${getUserById(sharedDocs[i].sharedByUserId).email}</td>
            </tr>`;
            // inserting row 
            var newRow = tableBodySharedUploads.insertRow();
            // updating row data
            newRow.innerHTML = rowData;
        }
    }
}

function addUploadOkClickHandler() {
    pageLoadHandler();

    // get docs from ls
    let docs = readFromLocalStorage("docs");

    // get data fron file input
    let fileName = document.getElementById('selectedFile').value;
    let label = document.getElementById("selectedFileLabel").value;
    fileName = fileName.replace('C:\\fakepath\\', ''); // To clean up the C:\fakepath\

    if (fileName.trim() == "") {
        alert("File is missing.");
        return;
    }
    if (label.trim() == "") {
        alert("File description is missing.");
        return;
    }

    fileUploadDetails = {
        id: "D" + Number(new Date()), // Epoch as unique ID
        addedByUserId: LOGGED_IN_USER_ID,
        fileName: fileName,
        label: label,
    }
    // console.log(fileUploadDetails);

    docs.push(fileUploadDetails);
    saveToLocalStorage("docs", docs);

    // setting value to blank
    document.getElementById('selectedFile').value = "";
    document.getElementById("selectedFileLabel").value = "";

    // refreshing the page after saving the doc
    location.href = "manage-documents.html";
}


function docDeleteBtn(element) {
    // console.log(element); // which element cicked the button
    DELETE_UPLOADED_DOC_ID = element.id;
    console.log(DELETE_UPLOADED_DOC_ID); // doc to be deleated
}


function docDeleteOkBtn() {

    let index = -1; // finding the index of element in user array
    let docs = readFromLocalStorage("docs");
    let sharedDocs = readFromLocalStorage("sharedDocs");

    // deleting from doc table
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].id == DELETE_UPLOADED_DOC_ID) {
            index = i;
        }
    }
    docs.splice(index, 1); // delete the index element
    saveToLocalStorage("docs", docs);

    // deleteing from shared doc table
    // for (let i = 0; i < sharedDocs.length; i++) {
    //     if (sharedDocs[i].docId == DELETE_UPLOADED_DOC_ID) {
    //         index = i;
    //     }
    // }
    // sharedDocs.splice(index, 1); // delete the index element
    // saveToLocalStorage("sharedDocs", sharedDocs);


    // refresh page to load the updated data
    manageDocumentsPageLoadHandler()
}

function docEditBtn(element) {
    console.log(element); // which element cicked the button
    EDIT_UPLOADED_DOC_ID = element.id;
    console.log(EDIT_UPLOADED_DOC_ID);
    let docs = readFromLocalStorage("docs");

    // showing existing label of doc
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].id == element.id) {
            // editDoc = docs[i];
            document.getElementById("edit-file-label-modal-input").value = docs[i].label;
            break;
        }
    }
}

function docEditOkBtn(element) {
    let docs = readFromLocalStorage("docs");

    for (let i = 0; i < docs.length; i++) {
        if (docs[i].id == EDIT_UPLOADED_DOC_ID) {
            let newLabel = document.getElementById("edit-file-label-modal-input").value;
            if (newLabel.trim() == "") {
                alert('File description is blank!');
                break;
            } else {
                docs[i].label = newLabel;
                break;
            }
        }
    }
    saveToLocalStorage("docs", docs);
    location.href = "manage-documents.html";
}

function sharePageLoadHandler() {
    pageLoadHandler()
    let users = readFromLocalStorage("users");
    let sharedDocs = readFromLocalStorage("sharedDocs");
    let docs = readFromLocalStorage("docs");

    let shareDocId = 0;
    try {
        // getting the args from the url
        let url = document.location.href,
            params = url.split('?')[1].split('&'),
            data = {}, tmp;
        for (let i = 0, l = params.length; i < l; i++) {
            tmp = params[i].split('=');
            data[tmp[0]] = tmp[1];
        }

        // checking for valid doc id
        for (let i = 0; i < docs.length; i++) {
            if (docs[i].id == data["shareDocId"]) {
                shareDocId = data["shareDocId"];
            }
        }

        if (shareDocId == 0) {
            alert("Invalid Doc ID!");
            location.href = "manage-documents.html";
        }

    } catch (err) {
        console.log(err.message);
        location.href = "manage-documents.html";
    }

    // doc id to be shared

    document.getElementById("add-share-btn").value = shareDocId;
    console.log("Doc Shared Id: ", shareDocId);

    // upload sharing list - shared by me display

    var mySharedDocTableBody = document.getElementById("my-shared-doc-list-table-body");
    for (let i = 0; i < sharedDocs.length; i++) {
        console.log(sharedDocs[i].docId, shareDocId)
        if (sharedDocs[i].docId == shareDocId) {
            rowData = ` <tr>
                <td>${getUserById(sharedDocs[i].sharedToUserId).fullName}</td>
                <td class="text-center">
                    <button type="button" class="btn" data-bs-toggle="modal"
                        data-bs-target="#deleteDocumentModal" id="${sharedDocs[i].id}" onclick="deleteSharedDocBtn(this)">
                        Delete</button>
                </td>
            </tr>`;
            // inserting row 
            var newRow = mySharedDocTableBody.insertRow();
            // updating row data
            newRow.innerHTML = rowData;
        }
    }

    // displaying all users

    let selectionOption = document.getElementById("selectedUser");

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == LOGGED_IN_USER_ID) {
            continue;
        } else {
            let toInsert = `<option value="${users[i].id}">${users[i].fullName}</option>`;
            selectionOption.innerHTML += toInsert;
        }
    }

    // doc name on top of page
    document.getElementById("share-page-doc-name").innerHTML = getDocById(shareDocId).fileName;
}

function deleteSharedDocBtn(element) {
    DELETE_SHARED_DOC_ID = element.id;
    console.log("Delete Share ID : ", DELETE_SHARED_DOC_ID);
}

function deleteSharedDocOkBtn() {
    let index = -1; // finding the index of element in user array
    let tmpDocId;
    let sharedDocs = readFromLocalStorage("sharedDocs");
    for (let i = 0; i < sharedDocs.length; i++) {
        if (sharedDocs[i].id == DELETE_SHARED_DOC_ID) {
            index = i;
            tmpDocId = sharedDocs[i].docId;
        }
    }
    sharedDocs.splice(index, 1); // delete the index element
    saveToLocalStorage("sharedDocs", sharedDocs);

    // refresh page to load the updated data
    location.href = `share.html?shareDocId=${tmpDocId}`;

}

function addShareBtnClick() {
    let shareToUserId = document.getElementById("selectedUser").value;
    let shareDocId = document.getElementById("add-share-btn").value;
    console.log("User Selected: " + shareToUserId + ", DOC ID : ", shareDocId);

    let sharedDocs = readFromLocalStorage("sharedDocs");

    // checking wether this doc is already shared with this particluar user
    let isThisDocSharedWithThisUser = false;
    for (let i = 0; i < sharedDocs.length; i++) {
        if (sharedDocs[i].docId == shareDocId && sharedDocs[i].sharedToUserId == shareToUserId) {
            isThisDocSharedWithThisUser = true;
        }
    }

    if (isThisDocSharedWithThisUser == false) {
        let newShareDoc = {
            id: "S" + Number(new Date()), // share id
            sharedByUserId: LOGGED_IN_USER_ID,
            sharedToUserId: shareToUserId,
            docId: shareDocId,
        }
        sharedDocs.push(newShareDoc);
        saveToLocalStorage("sharedDocs", sharedDocs);
        location.href = `share.html?shareDocId=${shareDocId}`;
    } else {
        alert("This doc is already shared with this user.");
    }
}

// User Management

function userManagementPageLoadHandler() {
    pageLoadHandler();

    // getting all users from local storage
    let users = readFromLocalStorage("users");
    // console.log(users);
    // getting user table
    var tableBody = document.getElementById("user-list-table-body");
    tableBody.innerHTML = ""; // clear previous data

    for (let i = 0; i < users.length; i++) {
        rowData = `<tr>
            <td>${users[i].fullName}</td>
            <td class="text-center">${users[i].email}</td>
            <td class="text-center">
                <a href="edit-users.html?editUserID=${users[i].id}"><button type="button" id="${users[i].id}" class="btn ">Edit</button></a> |
                <button 
                    type="button" 
                    id="${users[i].id}" 
                    onclick="userDeleteBtn(this)" 
                    class="btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#deleteUserModal"
                    ${users[i].id == LOGGED_IN_USER_ID ? "disabled" : ""}
                    >
                        Delete
                </button>
            </td>
        </tr>`;
        // inserting row 
        var newRow = tableBody.insertRow();
        // updating row data
        newRow.innerHTML = rowData;
    }
}

function editUserPageLoadHandler() {
    // getting the args from the url
    let url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (let i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    // all users list from LS
    let users = readFromLocalStorage("users");
    // user to be edited
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
    let users = readFromLocalStorage("users");
    // getting updated details
    let newFullName = document.forms["editUserForm"]["fullName"].value
    let newEmail = document.forms["editUserForm"]["email"].value

    // checing for blank values
    if (newFullName.trim() == "") {
        alert("Name can't be blank!");
        return false;
    } else if (newEmail.trim() == "") {
        alert("Email can't be blank!");
        return false;
    } else if (!isEmailValid(newEmail)) {
        alert("Email is invalid!");
        return false;
    }
    // execution will come here is the form is valid

    // updating user data and saving
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == EDIT_USER_ID) {
            users[i].fullName = newFullName;
            users[i].email = newEmail;
            // console.log("Edit User : ", users[i]);
            saveToLocalStorage("users", users);
            return true; // user data is saved and redirecting to user management
        }
    }
    return false; // user not found 
}

function userDeleteBtn(element) {
    // console.log(element); // which element cicked the button
    // console.log(element.id); // id to be deleated
    if (element.id == LOGGED_IN_USER_ID) {
        alert("Can't delete the loggedIn user");
        location.href = "users-management.html";
    }
    DELETE_USER_ID = element.id;
}

function userDeleteOk() {
    if (DELETE_USER_ID == LOGGED_IN_USER_ID) {
        alert("Can't delete the loggedIn user");
    } else {
        let index = -1; // finding the index of element in user array
        let users = readFromLocalStorage("users");
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == DELETE_USER_ID) {
                index = i;
            }
        }
        users.splice(index, 1); // delete the index element
        saveToLocalStorage("users", users);
    }

    // refresh page to load the updated users list
    userManagementPageLoadHandler();
}


// Group Chat Page

function prepareMessageToDisplay(msg) {
    // let thisMsg = "[" + msg.timestamp + "] " + msg.fullName + " : " + msg.msg + "<br>";
    let thisMsg = "[" + msg.timestamp + "] " + getUserById(msg.senderId).fullName + " : " + msg.msg + "<br>";
    return thisMsg;
}

function groupChatPageLoadHandler() {
    pageLoadHandler();

    // checking for old messages
    let msgs = readFromLocalStorage("messages");

    document.getElementById("group-chat-messages").innerHTML = "";
    for (let i = 0; i < msgs.length; i++) {
        let thisMsg = prepareMessageToDisplay(msgs[i]);
        document.getElementById("group-chat-messages").innerHTML += thisMsg;
    }
    // displaying current user full name
    document.getElementById("user-full-name").innerHTML = getUserById(LOGGED_IN_USER_ID).fullName;
}

function sendMessageGroupChat() {
    // get previous messages from local storage
    let messages = readFromLocalStorage("messages");
    // get current message
    let newMessage = document.getElementById("msg-input-group-chat").value;
    // checking for blank message
    if (newMessage.trim() == "") {
        alert("Message is blank!");
    } else { // if msg is not blank
        // appending new msg to previous msg and displaying
        let newMsgObj = {
            id: "M" + Number(new Date()),
            timestamp: new Date().toLocaleString(),
            senderId: LOGGED_IN_USER_ID,
            msg: newMessage.trim()
        }

        document.getElementById("group-chat-messages").innerHTML += prepareMessageToDisplay(newMsgObj);
        // removing message from input box
        document.getElementById("msg-input-group-chat").value = "";

        // saving msgs to local storage
        messages.push(newMsgObj);
        saveToLocalStorage("messages", messages);
    }
}

function refeshMessagesGroupChat() {
    // just reloading all the msgs
    groupChatPageLoadHandler();
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
    let users = readFromLocalStorage("users");

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
    } else if (!isEmailValid(email)) { // invalid email
        alert("Enter a valid email id!");
        return false;
    } else { // everything is valid
        // checking for email and password
        for (let i = 0; i < users.length; i++) {
            if (users[i].email == email && users[i].password == password) {
                // user is found in database
                // updating global variable
                LOGGED_IN_USER = users[i];
                LOGGED_IN_USER_ID = users[i].id;
                // deleting the password property from object
                delete LOGGED_IN_USER.password;
                // saving to local storage
                saveToLocalStorage("loggedInUser", LOGGED_IN_USER);

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
    document.getElementById("user-email").innerHTML = getUserById(LOGGED_IN_USER_ID).email;
}

// Registration Page

function validateRegisterFormSubmitHandler() {
    // Getting user data
    let users = readFromLocalStorage("users");

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
    } else if (!isEmailValid(email)) { // invalid email
        alert("Enter valid email id!");
        return false;
    } else { // If form is valid
        newUserObj = {
            id: "U" + Number(new Date()), // Epoch as unique ID
            fullName: fullName,
            email: email,
            password: password
        }
        if (users.length == 0) {
            // handling first user
            users.push(newUserObj);
            saveToLocalStorage("users", users);
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
                users.push(newUserObj);
                saveToLocalStorage("users", users);
                // user will be redirected to register successful page
                return true;
            }
        }
    }
}

// Logout Page

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    localStorage.setItem('loggedInUser', JSON.stringify([]));
    LOGGED_IN_USER = [];
    location.href = "logout.html";
}

// Welcome Page

function welcomePageLoadHandler() {
    // if any user is logged in
    // then redirect to login successful page
    // else do nothing - let them login or register
    let user = readFromLocalStorage("loggedInUser");
    if (user.length !== 0) {
        location.href = "login-successful.html";
    }
}