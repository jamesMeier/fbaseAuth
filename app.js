  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDSiCkhUM6gPRkY8j__50e9PWLQnP21eSw",
    authDomain: "fbauth-6f61e.firebaseapp.com",
    databaseURL: "https://fbauth-6f61e.firebaseio.com",
    projectId: "fbauth-6f61e",
    storageBucket: "",
    messagingSenderId: "556620878443",
    appId: "1:556620878443:web:eaf104086b6d1bd4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//reference to auth method of firebase

var auth = firebase.auth();

//get modal 
const modal = document.getElementById('modal');


//get element that closes modal
const close = document.getElementById('close');


// user click on x close button
close.addEventListener('click', () => {
    modal.style.display= 'none';
})

// when click outside modal close 
window.addEventListener('click', event => {
    if (event.target==modal) {
        modal.style.display='none';
    }
})

// get forms for email and apssword auth
const createUserForm = document.getElementById('create-user-form')
const forgotPasswordForm = document.getElementById('forgot-password-form')
const signInForm = document.getElementById('sign-in-form')

// get auth dialogues
const createUserDialog = document.getElementById('create-user-dialog')
const signInDialog = document.getElementById('sign-in-dialog')
const haveOrNeedAccountDialog = document.getElementById('have-or-need-account-dialog')


//invoked when user wants to create a new account
showCreateUserForm = () => {
    hideAuthElements();
    modal.style.display='block'
    createUserForm.classList.remove('hide');
    signInDialog.classList.remove('hide');
    haveOrNeedAccountDialog.classList.remove('hide')

}

//invoked when user wants to sign in 
showSignInForm = () => {
    hideAuthElements()
    modal.style.display='block'
    signInForm.classList.remove('hide');
    createUserDialog.classList.remove('hide');
    haveOrNeedAccountDialog.classList.remove('hide')
}

showForgotPasswordForm = () => {
    hideAuthElements();
    modal.style.display = 'block';
    forgotPasswordForm.classList.remove('hide')
}


// acces auth elements yo listen for auth action 

const authAction = document.querySelectorAll('.auth')
console.log(authAction)
// loop through elements and use auth att to determine what action to takewhen clicked

authAction.forEach(item => {
    item.addEventListener('click', event => {
        let chosen = event.target.getAttribute('auth')
        console.log(chosen)
        if (chosen === 'show-create-user-form'){
            showCreateUserForm()
        } else if (chosen === 'show-sign-in-form'){
            showSignInForm()
        } else if (chosen === 'show-forgot-password-form'){
            showForgotPasswordForm()
        };
    });
});

hideAuthElements = () => {
    createUserForm.classList.add('hide');
    signInDialog.classList.add('hide');
    signInForm.classList.add('hide');
    createUserDialog.classList.add('hide');
    haveOrNeedAccountDialog.classList.add('hide');
    forgotPasswordForm.classList.add('hide');
}

//uid  needs to be global. declare here but get the value from auth state listener
var uid

// firebase monitors the auth state in real time. use if/else satement to do diff things based on state

auth.onAuthStateChanged(user =>{
    if (user) {
        //code block runs if user is signed in
        uid = user.uid
        modal.style.display='none'
    } else {
        // bock runs if not signed in
        console.log('not signed in')
    }
});

createUserForm.addEventListener('submit', event => {
    event.preventDefault();
    const displayName = document.getElementById('create-user-display-name').value
    const email = document.getElementById('create-user-email').value
    const password = document.getElementById('create-user-password').value
    // console.log(displayName);
    // console.log(email);
    // console.log(password);
    auth.createUserWithEmailAndPAssword(email, password)
    .then(() => {
        //using firebase.auth due to scoping issue
        firebase.auth().currentUser.updateProfile({
            //object       grabbing from form
            displayName: displayName
        })
        createUserForm.reset()
        hideAuthElements()
    })
    .catch(error => {
        console.log(error.message)
        
    })
})