
// Reusable function with parameter and return value
const getElement = (id) => {
    return document.getElementById(id);
};

// Get page elements
const registerPage = getElement("registerPage");
const loginPage = getElement("loginPage");
const dashboardPage = getElement("dashboardPage");

// Reusable function to display a page
const showPage = (page) => {
    registerPage.classList.add("hidden");
    loginPage.classList.add("hidden");
    dashboardPage.classList.add("hidden");

    page.classList.remove("hidden");
};

// Reusable password validation function
const validatePassword = (password) => {
    return password.length >= 6;
};

// Get saved user from browser storage
const getUser = () => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
};

// Register form validation
getElement("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = getElement("regName").value.trim();
    const email = getElement("regEmail").value.trim().toLowerCase();
    const password = getElement("regPassword").value;
    const message = getElement("registerMessage");

    if (!name || !email || !password) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (!validatePassword(password)) {
        message.textContent =
            "Password must contain at least 6 characters.";
        return;
    }

    // Demo assignment only: never store plaintext passwords in production.
    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    message.textContent = "Account created successfully!";
    getElement("registerForm").reset();
    getElement("loginMessage").textContent =
        "Account created. Please login.";

    showPage(loginPage);
});

// Open Login page
getElement("showLogin").addEventListener("click", (event) => {
    event.preventDefault();
    showPage(loginPage);
});

// Open Register page
getElement("showRegister").addEventListener("click", (event) => {
    event.preventDefault();
    showPage(registerPage);
});

// Login form validation
getElement("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = getElement("loginEmail").value.trim().toLowerCase();
    const password = getElement("loginPassword").value;
    const message = getElement("loginMessage");

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        return;
    }

    const user = getUser();

    if (!user || user.email !== email || user.password !== password) {
        message.textContent = "Invalid email or password.";
        return;
    }

    // Store login status for this browser tab
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("userName", user.name);

    getElement("welcomeMessage").textContent =
        "Welcome, " + user.name + "!";

    getElement("loginForm").reset();
    message.textContent = "";

    showPage(dashboardPage);
});

// Logout
getElement("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("userName");

    getElement("loginMessage").textContent = "Please login again.";
    showPage(loginPage);
});
