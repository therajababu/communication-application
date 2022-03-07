// Global variable

let LOGGED_IN_USER = [];
let LOGGED_IN_USER_ID;
let EDIT_USER_ID = "";
let DELETE_USER_ID;
let EDIT_DOC_ROW_INDEX;
let EDIT_DOC_ID;

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
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].sharedByID == LOGGED_IN_USER.id) {
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
        if (sharedDocs[i].sharedToId == LOGGED_IN_USER.id) {
            rowData = `<tr>
                <td>${getDocById(sharedDocs[i].docId).label}</td>
                <td class="text-center">${getDocById(sharedDocs[i].docId).fileName}</td>
                <td class="text-center">${getUserById(sharedDocs[i].sharedToId).email}</td>
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
        sharedByID: LOGGED_IN_USER.id,
        fileName: fileName,
        label: label,
        sharedByEmail: LOGGED_IN_USER.email,
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
    // console.log(element.id); // id to be deleated

    DELETE_DOC_ROW_INDEX = element.parentNode.parentNode.rowIndex;
    console.log("Row Index : ", DELETE_DOC_ROW_INDEX);
    // return false;
}


function docDeleteOkBtn(element) {
    // checking the element who calls
    // console.log(element);

    document.getElementById("my-uploads-list-table-body").deleteRow(DELETE_DOC_ROW_INDEX - 1);
    let docs = readFromLocalStorage("docs");
    docs.splice(DELETE_DOC_ROW_INDEX - 1, 1);
    saveToLocalStorage("docs", docs);
}

function docEditBtn(element) {
    console.log(element); // which element cicked the button
    console.log(element.id); // id to be deleated
    let docs = readFromLocalStorage("docs");

    for (let i = 0; i < docs.length; i++) {
        if (docs[i].id == element.id) {
            // editDoc = docs[i];
            document.getElementById("edit-file-label-modal-input").value = docs[i].label;
            break;
        }
    }
    EDIT_DOC_ROW_INDEX = element.parentNode.parentNode.rowIndex;
    EDIT_DOC_ID = element.id;

    console.log("Row Index : ", EDIT_DOC_ROW_INDEX, ", DOC ID : ", EDIT_DOC_ID);
    // return false;
}

function docEditOkBtn(element) {
    let docs = readFromLocalStorage("docs");

    for (let i = 0; i < docs.length; i++) {
        if (docs[i].id == EDIT_DOC_ID) {
            let newLabel = document.getElementById("edit-file-label-modal-input").value;
            docs[i].label = newLabel;
            break;
        }
    }
    saveToLocalStorage("docs", docs);
    location.href = "manage-documents.html";
}

function sharePageLoadHandler() {
    pageLoadHandler()

    // getting the args from the url
    let url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (let i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }

    // doc id to be shared
    let shareDocId = data["shareDocId"];
    document.getElementById("add-share-btn").value = shareDocId;
    console.log("Doc Shared Id: ", shareDocId);

    // displaying all users
    let users = readFromLocalStorage("users");
    let selectionOption = document.getElementById("selectedUser");

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == LOGGED_IN_USER) {
            continue;
        } else {
            let toInsert = `<option value="${users[i].id}">${users[i].fullName}</option>`;
            selectionOption.innerHTML += toInsert;
        }
    }

    // doc name on top of page
    document.getElementById("share-page-doc-name").innerHTML = getDocById(shareDocId).fileName;

    // upload sharing list - shared by me display
    let sharedDocs = readFromLocalStorage("sharedDocs");
    var mySharedDocTableBody = document.getElementById("my-shared-doc-list-table-body");
    for (let i = 0; i < sharedDocs.length; i++) {
        console.log(sharedDocs[i].docId, shareDocId)
        if (sharedDocs[i].docId == shareDocId) {
            rowData = ` <tr>
                <td>${getUserById(sharedDocs[i].sharedToId).fullName}</td>
                <td class="text-center">
                    <button type="button" class="btn" data-bs-toggle="modal"
                        data-bs-target="#deleteDocumentModal" onclick="deleteSharedDoc(${sharedDocs[i].id})">
                        Delete</button>
                </td>
            </tr>`;
            // inserting row 
            var newRow = mySharedDocTableBody.insertRow();
            // updating row data
            newRow.innerHTML = rowData;
        }
    }

}

function deleteSharedDoc(sharedId) {
    let sharedDocs = readFromLocalStorage("sharedDocs");

    for (let i = 0; i < sharedDocs.length; i++) {
        if (sharedDocs[i].id == sharedId) {
            console.log("Before : ", sharedDocs);
            sharedDocs.splice(i, 1);
            console.log("After : ", sharedDocs);
            break;
        }
    }
    saveToLocalStorage("sharedDocs", sharedDocs);
    location.href = "share.html";
}

function addShareBtnClick() {
    let shareToUserId = document.getElementById("selectedUser").value;
    let shareDocId = document.getElementById("add-share-btn").value;
    console.log("User Selected: " + shareToUserId + ", DOC ID : ", shareDocId);

    // add to ls
    let sharedDocs = readFromLocalStorage("sharedDocs");

    let newShareDoc = {
        id: "S" + Number(new Date()),
        sharedById: LOGGED_IN_USER_ID,
        sharedToId: shareToUserId,
        docId: shareDocId,
    }

    sharedDocs.push(newShareDoc);
    saveToLocalStorage("sharedDocs", sharedDocs);
    location.href = "share.html";
}

// User Management

function userManagementPageLoadHandler() {
    pageLoadHandler();

    // getting all users from local storage
    let users = readFromLocalStorage("users");
    // console.log(users);
    // getting user table
    var tableBody = document.getElementById("user-list-table-body");
    tableBody.innerHTML = "";

    for (let i = 0; i < users.length; i++) {
        rowData = `<tr>
            <td>${users[i].fullName}</td>
            <td class="text-center">${users[i].email}</td>
            <td class="text-center">
                <a href="edit-users.html?editUserID=${users[i].id}"><button type="button" id="${users[i].id}" class="btn ">Edit</button></a> |
                <button type="button" id="${users[i].id}" onclick="userDeleteBtn(this)" class="btn" data-bs-toggle="modal" data-bs-target="#deleteUserModal">
                    Delete</button>
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
    if(element.id == LOGGED_IN_USER_ID){
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
        for(let i = 0; i < users.length; i++) {
            if(users[i].id == DELETE_USER_ID){
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
    let thisMsg = "[" + msg.timestamp + "] " + msg.fullName + " : " + msg.msg + "<br>";
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
            userID: LOGGED_IN_USER_ID,
            fullName: getUserById(LOGGED_IN_USER_ID).fullName,
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