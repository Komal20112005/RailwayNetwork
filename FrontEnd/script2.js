// DOM Elements
const emailTab = document.getElementById('email-tab');
const emailForm = document.getElementById('email-form');
const emailLoginForm = document.getElementById('email-login-form');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eye-icon');
const eyeOffIcon = document.getElementById('eye-off-icon');
const emailSubmitBtn = document.getElementById('email-submit');
const signupBtn = document.getElementById('signup-btn');
const signupModal = document.getElementById('signup-modal');
const closeModalBtn = document.getElementById('close-modal');
const signupForm = document.getElementById('signup-form');
const toast = document.getElementById('toast');

// Toast Notification System
function showToast(title, description, type = 'success') {
    const toastTitle = toast.querySelector('.toast-title');
    const toastDescription = toast.querySelector('.toast-description');
    
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Password Toggle
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.style.display = isPassword ? 'none' : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';
});

// Sign In Form Submit
emailLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showToast('Login Failed', 'Please fill in all fields', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('optirailz_users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        showToast('Account Not Found', 'Please sign up first.', 'error');
        return;
    }

    if (user.password !== password) {
        showToast('Login Failed', 'Incorrect password.', 'error');
        return;
    }

    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    showToast('Login Successful', `Welcome, ${user.name}!`, 'success');

    setTimeout(() => {
        window.location.href = './index.html';
    }, 1500);
});

// Sign Up Modal Open/Close
signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
});
closeModalBtn.addEventListener('click', () => {
    signupModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === signupModal) signupModal.style.display = 'none';
});

// Sign Up Submit
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('signup-confirm-password').value.trim();

    if (!name || !email || !password || !confirmPassword) {
        showToast('Error', 'All fields are required.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Error', 'Passwords do not match.', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('optirailz_users') || '[]');

    if (users.some(u => u.email === email)) {
        showToast('Error', 'Email already registered.', 'error');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('optirailz_users', JSON.stringify(users));
    showToast('Account Created', 'You can now sign in.', 'success');
    signupForm.reset();
    signupModal.style.display = 'none';
    document.getElementById('email').value = email;
    passwordInput.focus();
});