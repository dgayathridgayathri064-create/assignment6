
"use strict";

// Reusable function to get an HTML element
const getElement = (id) => document.getElementById(id);

// Function to show a page
const showPage = (pageId) => {
    ["registerPage", "loginPage", "dashboardPage"].forEach((id) => {
        getElement(id).classList.toggle("hidden", id !== pageId);
    });
};

// Function with a parameter and return value
const isValidPassword = (password) => password.length >= 6;

// Read registered user from browser storage
const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("authUser")) || null;
    } catch {
        return null;
    }
};

// Show the correct starting page
if (sessionStorage.getItem("loggedIn") === "true" && getUser()) {
    showDashboard();
} else {
    sessionStorage.removeItem("loggedIn");
    showPage("registerPage");
}

// Switch between Register and Login
getElement("showLogin").addEventListener("click", (event) => {
    event.preventDefault();
    getElement("loginMessage").textContent = "";
    showPage("loginPage");
});

getElement("showRegister").addEventListener("click", (event) => {
    event.preventDefault();
    getElement("registerMessage").textContent = "";
    showPage("registerPage");
});

// Register account
getElement("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = getElement("regName").value.trim();
    const email = getElement("regEmail").value.trim().toLowerCase();
    const password = getElement("regPassword").value;
    const confirmPassword = getElement("confirmPassword").value;
    const message = getElement("registerMessage");

    if (!name || !email || !password || !confirmPassword) {
        message.textContent = "Please fill in all fields.";
        message.style.color = "red";
        return;
    }

    if (!isValidPassword(password)) {
        message.textContent = "Password must have at least 6 characters.";
        message.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
    }

    if (getUser()) {
        message.textContent = "An account already exists in this browser.";
        message.style.color = "red";
        return;
    }

    // Demo only: never store real passwords in browser storage
    const user = { name, email, password };
    localStorage.setItem("authUser", JSON.stringify(user));

    message.style.color = "green";
    message.textContent = "Account created! Please login.";

    getElement("registerForm").reset();
    getElement("loginEmail").value = email;
    showPage("loginPage");
});

// Login account
getElement("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = getElement("loginEmail").value.trim().toLowerCase();
    const password = getElement("loginPassword").value;
    const user = getUser();
    const message = getElement("loginMessage");

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        message.style.color = "red";
        return;
    }

    if (!user || user.email !== email || user.password !== password) {
        message.textContent = "Invalid email or password.";
        message.style.color = "red";
        return;
    }

    sessionStorage.setItem("loggedIn", "true");
    getElement("loginForm").reset();
    showDashboard();
});

// Dashboard function
function showDashboard() {
    const user = getUser();

    if (!user || sessionStorage.getItem("loggedIn") !== "true") {
        showPage("loginPage");
        return;
    }

    getElement("welcomeMessage").textContent =
        `Welcome, ${user.name}!`;

    showPage("dashboardPage");
}

// Logout
getElement("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    getElement("loginMessage").textContent = "";
    showPage("loginPage");
});
