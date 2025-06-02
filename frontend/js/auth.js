// API URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabBtns = document.querySelectorAll('.tab-btn');

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and forms
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content form').forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked button and corresponding form
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}Form`).classList.add('active');
    });
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.user.role !== role) {
                alert('Role does not match this account.');
                return;
            }
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            switch (data.user.role) {
                case 'student':
                    window.location.href = 'student.html';
                    break;
                case 'faculty':
                    window.location.href = 'faculty.html';
                    break;
                case 'coordinator':
                    window.location.href = 'coordinator.html';
                    break;
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
            // Clear register form
            registerForm.reset();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
    }
}); 