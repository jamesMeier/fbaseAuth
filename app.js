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
const hideOrNeedAccountDialog = document.getElementById('hide-or-need-account-dialog')


//invoked when user wants to create a new account
showCreateUserForm = () => {
    modal.style.display='block'
    createUserForm.classList.remove('hide');
    signInDialog.classList.remove('hide');
    hideOrNeedAccountDialog.classList.remove('hide')

}

//invoked when user wants to sign in 
showSignInForm = () => {
    modal.style.display='block'

}

showForgotPasswordForm = () => {
    hideAuthElements()
    forgotPasswordForm.classList.remove('hide')
}

hideAuthElements = () => {
    createUserForm.classList.add('hide');
    signInDialog.classList.add('hide');
    signInForm.classList.add('hide');
    createUserDialog.classList.add('hide');
    hideOrNeedAccountDialog.classList.add('hide');
    forgotPasswordForm.classList.add('hide');
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