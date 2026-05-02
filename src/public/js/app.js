// Funciones de utilidad para cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function isAuthenticated() {
    return !!getCookie('token');
}

function getUserRoles() {
    const token = getCookie('token');
    if (!token) return [];
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles || [];
    } catch (e) {
        return [];
    }
}

function logout() {
    window.location.href = '/logout';
}

function updateNav() {
    const isAuth = isAuthenticated();
    const roles = getUserRoles();
    const isAdmin = roles.includes('admin');

    const navSignin = document.querySelectorAll('#nav-signin, #nav-signin-mobile');
    const navSignup = document.querySelectorAll('#nav-signup, #nav-signup-mobile');
    const navDashboard = document.querySelectorAll('#nav-dashboard, #nav-dashboard-mobile');
    const navAdmin = document.querySelectorAll('#nav-admin, #nav-admin-mobile');
    const navProfile = document.querySelectorAll('#nav-profile, #nav-profile-mobile');
    const navLogout = document.querySelectorAll('#nav-logout, #nav-logout-mobile');
    
    navSignin.forEach(el => el.style.display = isAuth ? 'none' : 'block');
    navSignup.forEach(el => el.style.display = isAuth ? 'none' : 'block');
    navDashboard.forEach(el => el.style.display = isAuth ? 'block' : 'none');
    navProfile.forEach(el => el.style.display = isAuth ? 'block' : 'none');
    navLogout.forEach(el => el.style.display = isAuth ? 'block' : 'none');
    
    if (isAdmin) {
        navAdmin.forEach(el => el.style.display = 'block');
    } else {
        navAdmin.forEach(el => el.style.display = 'none');
    }
}

// API calls (para datos, no para auth)
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (response.status === 401) {
        window.location.href = '/logout';
        return;
    }

    return response.json();
}

// Load profile
async function loadProfile() {
    try {
        const data = await apiRequest('/api/users/me');
        if (data) {
            document.getElementById('profile-data').innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${data.name} ${data.lastName || ''}</span>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Teléfono:</strong> ${data.phoneNumber || 'No especificado'}</p>
                        <p><strong>Fecha de nacimiento:</strong> ${data.birthdate ? new Date(data.birthdate).toLocaleDateString() : 'No especificada'}</p>
                        <p><strong>Dirección:</strong> ${data.address || 'No especificada'}</p>
                        <p><strong>Rol:</strong> ${data.roles.join(', ')}</p>
                        <p><strong>Registro:</strong> ${new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="card-action">
                        <button class="btn waves-effect waves-light" onclick="showEditForm()">Editar Perfil</button>
                    </div>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error loading profile:', err);
    }
}

// Load users (admin)
async function loadUsers() {
    try {
        const users = await apiRequest('/api/users');
        if (users && Array.isArray(users)) {
            const tbody = document.getElementById('users-tbody');
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td>${u.name} ${u.lastName || ''}</td>
                    <td>${u.email}</td>
                    <td>${u.phoneNumber || '-'}</td>
                    <td>${u.roles.join(', ')}</td>
                    <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-small waves-effect waves-light" onclick="viewUser('${u.id}')">
                            <i class="material-icons">visibility</i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading users:', err);
    }
}

function viewUser(userId) {
    window.location.href = `/api/users/${userId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateNav();
    
    // Profile page
    if (document.getElementById('profile-data')) {
        if (!isAuthenticated()) {
            window.location.href = '/signIn';
        } else {
            loadProfile();
        }
    }

    // Dashboard
    if (document.getElementById('dashboard-content')) {
        if (!isAuthenticated()) {
            window.location.href = '/signIn';
        }
    }

    // Admin dashboard
    if (document.getElementById('users-tbody')) {
        if (!isAuthenticated()) {
            window.location.href = '/signIn';
        } else if (!getUserRoles().includes('admin')) {
            window.location.href = '/403';
        } else {
            loadUsers();
        }
    }
});