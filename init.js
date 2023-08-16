

// create a variable for the login form
const form = document.querySelector("#form_login");
console.log("form ",form);
// if the form exists, run the class
if (form) {
    // setup the fields we want to validate, we only have two but you can add others
    const fields = ["email", "password"];
    // run the class
    console.log("fields ",fields);
    const validator = new Login(form, fields);
}else{
    const auth = new Auth();

    document.querySelector(".logout").addEventListener("click", (e) => {
        auth.logOut();
    });
}