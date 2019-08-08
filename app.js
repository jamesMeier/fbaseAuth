// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDSiCkhUM6gPRkY8j__50e9PWLQnP21eSw",
    authDomain: "fbauth-6f61e.firebaseapp.com",
    databaseURL: "https://fbauth-6f61e.firebaseio.com",
    projectId: "fbauth-6f61e",
    storageBucket: "fbauth-6f61e.appspot.com",
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
    modal.style.display = 'none';
})

// when click outside modal close 
window.addEventListener('click', event => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
})

// get forms for email and apssword auth
const createUserForm = document.getElementById('create-user-form')
const forgotPasswordForm = document.getElementById('forgot-password-form')
const signInForm = document.getElementById('sign-in-form')

//get element that holds oauth providers
const oauthProviders = document.getElementById('oauth-providers')

// get auth dialogues
const createUserDialog = document.getElementById('create-user-dialog')
const signInDialog = document.getElementById('sign-in-dialog')
const haveOrNeedAccountDialog = document.getElementById('have-or-need-account-dialog')

//get eleemtn where email verification will be placed
const emailNotVerifiedNotification = document.getElementById('email-not-verified-notification')


// gt elements that eed to be hidden or shown base on auth state

const hideWhenSignedIn = document.querySelectorAll('.hide-when-signed-in')
const hideWhenSignedOut = document.querySelectorAll('.hide-when-signed-out')

//get access to element where we shall place our error/success message
const authMessage = document.getElementById('message')
// acces auth elements yo listen for auth action 
const authAction = document.querySelectorAll('.auth')
// console.log(authAction)


//invoked when user wants to create a new account
showCreateUserForm = () => {
    hideAuthElements();
    modal.style.display = 'block'
    oauthProviders.classList.remove('hide')
    createUserForm.classList.remove('hide');
    signInDialog.classList.remove('hide');
    haveOrNeedAccountDialog.classList.remove('hide')

}

//invoked when user wants to sign in 
showSignInForm = () => {
    hideAuthElements()
    modal.style.display = 'block'
    oauthProviders.classList.remove('hide')
    signInForm.classList.remove('hide');
    createUserDialog.classList.remove('hide');
    haveOrNeedAccountDialog.classList.remove('hide')
}

showForgotPasswordForm = () => {
    hideAuthElements();
    // modal.style.display = 'block';
    forgotPasswordForm.classList.remove('hide')
}

// invoked whwn user want to sign out
signOut = () => {
    hideAuthElements()
    auth.signOut()
    console.log()

}

// loop through elements and use auth att to determine what action to takewhen clicked

authAction.forEach(item => {
    item.addEventListener('click', event => {
        let chosen = event.target.getAttribute('auth')
        // console.log(chosen)
        if (chosen === 'show-create-user-form') {
            showCreateUserForm()
        } else if (chosen === 'show-sign-in-form') {
            showSignInForm()
        } else if (chosen === 'show-forgot-password-form') {
            showForgotPasswordForm()
        } else if (chosen === `sign-out`) {
            signOut()
        };
    });
});

hideAuthElements = () => {
    clearMessage()
    loading('hide')
    oauthProviders.classList.add('hide')
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

// Firebase monitors the auth state in real time. Use an if/else statement to do different
auth.onAuthStateChanged(user => {
    if (user) {
        // Everything inside here happens if user is signed in
        console.log(user)
        uid = user.uid
        modal.style.display = `none`
        // Hides or shows elements depending on if user is signed in
        hideWhenSignedIn.forEach(eachItem => {
            eachItem.classList.add(`hide`)
        })
        hideWhenSignedOut.forEach(eachItem => {
            eachItem.classList.remove(`hide`)
        })

        if(user.displayName) {
            document.getElementById(`display-name-header`).textContent = `Hello, ${user.displayName}`
         }
        //happens if localstorgae has info saying user is authenticated with email
        if(localStorage.getItem('isAuthenticatedWithEmail')) {
            //happens if emailverified = false
            if (!user.emailVerified) {
                //happens if verification = null
                if (!localStorage.getItem('emailVerificationSent')) {
                    //send email
                    user.sendEmailVerification().then(()=> {
                        localStorage.setItem('emailVerificationSent', 'true');
                    }) 
                } else {
                    console.log('verification email has been sent');  
                }
                emailNotVerifiedNotification.textContent=`Email not verified, Click the link inside the email we sent to ${user.email}`
                emailNotVerifiedNotification.classList.remove('hide')
            }

        }
        
    } else {
        // Everything inside here happens if user is not signed in
        console.log('not signed in');
        // Hides or shows elements depending on if user is signed out
        hideWhenSignedIn.forEach(eachItem => {
            eachItem.classList.remove(`hide`)
        })
        hideWhenSignedOut.forEach(eachItem => {
            eachItem.classList.add(`hide`)
        })
    }
})

createUserForm.addEventListener('submit', event => {
    event.preventDefault();
    loading('show')
    const displayName = document.getElementById('create-user-display-name').value
    const email = document.getElementById('create-user-email').value
    const password = document.getElementById('create-user-password').value
    // console.log(displayName);
    // console.log(email);
    // console.log(password);
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            //using firebase.auth due to scoping issue
            firebase.auth().currentUser.updateProfile({
                //object       grabbing from form
                displayName: displayName
            })
            createUserForm.reset()
            hideAuthElements()
            localStorage.setItem('IsAuthenticatedWithEmail', 'true')
        })
        .catch(error => {
            loading('hide')
            displayMessage('error', error.message)

        })
})

signInForm.addEventListener('submit', event => {
    event.preventDefault();
    loading('show')
    const email = document.getElementById('sign-in-email').value
    const password = document.getElementById('sign-in-password').value
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            signInForm.reset()
            hideAuthElements()
            localStorage.setItem('isAuthenticatedWithEmail', 'true')
        })
        .catch(error => {
            loading('hide')
            displayMessage(`error`, error.message);

        })
})

forgotPasswordForm.addEventListener('submit', event => {
    event.preventDefault();
    loading('show')
    email = document.getElementById('forgot-password-email').value
    auth.sendPasswordResetEmail(email)
        .then(() => {
            loading('hide')
            forgotPasswordForm.reset()
            displayMessage(`success`, 'Message sent. Please check your email')
            // console.log('message sent. please check your email');

        })
        .catch(error => {
            loading('hide')
            displayMessage('error', error.message);

        })
})

// makes the error messageTimeout  and success timeout global so that the clear timeout meothd will work when invoked

let messageTimeout

// error n mesage handling 
displayMessage = (type, message) => {
    if (type === 'error') {
        authMessage.style.borderColor = 'red'
        authMessage.style.color = 'red'
        authMessage.style.display = "block"
    } else if (type === 'success') {
        authMessage.style.borderColor = 'green'
        authMessage.style.color = 'green'
        authMessage.style.display = "block"
    }

    authMessage.innerHTML = message
    messageTimeout = setTimeout(() => {
        authMessage.innerHTML = ''
        authMessage.style.display = 'none'
    }, 7000)
}

clearMessage = () => {
    clearTimeout(messageTimeout)
    authMessage.innerHTML = ''
    authMessage.style.display = 'none'
}

//function to hide and show loading visual cue

loading = (action) => {
    if (action==='show') {
        document.getElementById('loading-outer-container').style.display= 'block'
    } else if (action === 'hide'){
        document.getElementById('loading-outer-container').style.display= 'none'
        
    } else {
        console.log('loading error');
    }
}
