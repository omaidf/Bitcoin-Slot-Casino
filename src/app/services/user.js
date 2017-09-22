const user = {
    name: "",
    email: ""
}

function getEmail() {
    return user.email;
}

function setEmail(email) {
    user.email = email;
}

export default {
    getEmail,
    setEmail
}