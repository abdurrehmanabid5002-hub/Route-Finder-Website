/* eslint-env browser */
/**
 * SMART ROUTE FINDER — AUTHENTICATION & THEME SYNC SYSTEM
 * Shared utility loaded on all pages.
 */

// 0. GATEWAY AUTHENTICATION CHECK (Restricts access to website if not logged in)
(function() {
    const isAuthPage = window.location.pathname.toLowerCase().includes('auth.html') || 
                       window.location.pathname.toLowerCase().endsWith('/auth');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser && !isAuthPage) {
        window.location.href = 'auth.html';
    } else if (currentUser && isAuthPage) {
        window.location.href = 'index.html';
    }
})();

// 1. IMMEDIATE THEME SYNCHRONIZATION (Prevents white flashing)
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        // Apply to body as soon as DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('dark');
        });
    } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.remove('dark');
        });
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('dark');
        });
    }
})();

// Initialize mock database if empty
document.addEventListener('DOMContentLoaded', () => {
    const defaultUsers = [
        { name: 'Demo User', email: 'demo@example.com', password: 'Password123' },
        { name: 'Abdur Rehman Abid', email: 'abdur@gmail.com', password: 'Password123' },
        { name: 'Amna Waheed', email: 'amna@gmail.com', password: 'Password123' }
    ];
    if (!localStorage.getItem('registeredUsers')) {
        localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    }

    // Initialize navbar
    initNavbarAuth();
    
    // Inject custom auth-shared styles
    injectSharedStyles();

    // Dynamically inject settings and profile modals
    injectAuthModals();
    
    // Handle closing dropdown or modals on outside clicks
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('userDropdownMenu');
        if (dropdown && dropdown.classList.contains('active')) {
            if (!dropdown.contains(e.target) && !e.target.closest('.nav-btn-user')) {
                dropdown.classList.remove('active');
            }
        }

        const openModals = document.querySelectorAll('.auth-modal-overlay.active');
        openModals.forEach(modal => {
            const card = modal.querySelector('.auth-modal-content');
            if (card && !card.contains(e.target) && !e.target.closest('.user-dropdown-item-link')) {
                modal.classList.remove('active');
            }
        });
    });
});

/**
 * Generates a clean, custom inline SVG avatar with user initials.
 * Avoids any cross-origin resource block (COEP) issues on production Vercel.
 */
function getAvatarSvg(name, size = 28) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#5b43f3', '#0284c7', '#db2777', '#7c3aed', '#20b26c', '#f0a300', '#ff4757'];
    const color = colors[Math.abs(hash) % colors.length];
    const fontSize = Math.floor(size * 0.42);
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="user-avatar-svg" style="border-radius: 50%; display: block; flex-shrink: 0;">
            <rect width="100%" height="100%" fill="${color}" />
            <text x="50%" y="54%" fill="white" font-size="${fontSize}px" font-weight="600" font-family="'Poppins', sans-serif" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        </svg>
    `.trim();
}

/**
 * Initializes and dynamically updates the authentication state in the navigation bar.
 */
function initNavbarAuth() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const navbar = document.querySelector('.navbar');

    // Remove any existing login button, user menu, or dropdown to avoid duplicates
    const existingLogin = document.getElementById('navLoginBtn');
    const existingUser = document.getElementById('userMenuContainer');
    const existingDropdown = document.getElementById('userDropdownMenu');
    if (existingLogin) existingLogin.remove();
    if (existingUser) existingUser.remove();
    if (existingDropdown) existingDropdown.remove();

    const currentUserStr = localStorage.getItem('currentUser');
    
    if (currentUserStr) {
        // User is logged in
        const user = JSON.parse(currentUserStr);
        const nameParts = user.name.split(' ');
        const displayName = nameParts[0]; // First name for compact layout
        let avatarHtml = '';
        if (user.picture) {
            const escapedName = user.name.replace(/'/g, "\\'");
            avatarHtml = `<img src="${user.picture}" crossorigin="anonymous" class="user-avatar" alt="Avatar" onerror="this.outerHTML=getAvatarSvg('${escapedName}', 28)">`;
        } else {
            avatarHtml = getAvatarSvg(user.name, 28);
        }

        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu-container';
        userMenu.id = 'userMenuContainer';
        userMenu.innerHTML = `
            <button class="nav-btn-user" onclick="toggleUserDropdown(event)">
                <div class="user-avatar-wrapper" style="display: flex; align-items: center; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.8);">
                    ${avatarHtml}
                </div>
                <span class="user-name-text" style="margin-left: 2px;">${displayName}</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 11px; margin-left: 2px;"></i>
            </button>
        `;
        navLinks.appendChild(userMenu);

        // Create the dropdown menu as a direct child of the navbar to avoid mobile overflow-x clipping
        if (navbar) {
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown-menu';
            dropdown.id = 'userDropdownMenu';
            dropdown.innerHTML = `
                <div class="user-dropdown-header">
                    <div class="user-avatar-wrapper" style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.08);">
                        ${getAvatarSvg(user.name, 32)}
                    </div>
                    <div class="user-dropdown-details">
                        <span class="user-dropdown-username">${user.name}</span>
                        <span class="user-dropdown-email">${user.email}</span>
                    </div>
                </div>
                <div class="user-dropdown-divider"></div>
                <ul class="user-dropdown-list">
                    <li class="user-dropdown-item-link" onclick="openAuthModal('profileModal'); toggleUserDropdown(event);">
                        <i class="fa-regular fa-user"></i>
                        <span>Your Profile</span>
                    </li>
                    <li class="user-dropdown-item-link" onclick="openAuthModal('settingsModal'); toggleUserDropdown(event);">
                        <i class="fa-solid fa-gear"></i>
                        <span>Settings</span>
                    </li>
                    <li class="user-dropdown-item-link" onclick="if (typeof focusRouteFinder === 'function') { focusRouteFinder(); } toggleUserDropdown(event);">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>Route Finder</span>
                    </li>
                    <li class="user-dropdown-item-link" onclick="toggleDarkMode(); toggleUserDropdown(event);">
                        <i class="fa-regular fa-moon"></i>
                        <span>Toggle Theme</span>
                    </li>
                </ul>
                <div class="user-dropdown-divider"></div>
                <button class="user-dropdown-logout-btn" onclick="logoutUser()">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sign out</span>
                </button>
            `;
            navbar.appendChild(dropdown);
        }
    } else {
        // User is logged out
        const loginBtn = document.createElement('button');
        loginBtn.className = 'nav-btn-login';
        loginBtn.id = 'navLoginBtn';
        // Check if on auth page itself to disable navigation action
        const isAuthPage = window.location.pathname.includes('auth.html');
        loginBtn.onclick = () => {
            if (!isAuthPage) {
                window.location.href = 'auth.html';
            }
        };
        loginBtn.innerHTML = `
            <i class="fa-solid fa-user"></i>
            Sign In
        `;
        navLinks.appendChild(loginBtn);
    }
}

/**
 * Toggles visibility of the user dropdown menu in the navbar
 */
function toggleUserDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('userDropdownMenu');
    if (!dropdown) return;
    dropdown.classList.toggle('active');
}

/**
 * Log out user by deleting local state and reloading/redirecting.
 */
function logoutUser() {
    localStorage.removeItem('currentUser');
    
    // Create standard toast
    if (typeof showToast === 'function') {
        showToast("Signed out successfully!", "success");
    }
    
    // Refresh page or redirect to auth
    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 500);
}

/**
 * Dynamically injects styling for the sharing header elements
 */
function injectSharedStyles() {
    if (document.getElementById('auth-shared-styles')) return;

    const styles = `
        /* Dynamic Navbar Authentication Styles */
        .nav-btn-login {
            background: rgba(255, 255, 255, 0.18) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
            font-weight: 600 !important;
            padding: 10px 22px !important;
            border-radius: 14px !important;
            cursor: pointer;
            font-size: 15px !important;
            color: white !important;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            outline: none;
        }

        .nav-btn-login:hover {
            background: #ffffff !important;
            color: #5b43f3 !important;
            border-color: #ffffff !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25);
        }

        .user-menu-container {
            position: relative;
            display: inline-block;
        }

        .nav-btn-user {
            border: none !important;
            background: rgba(255, 255, 255, 0.15) !important;
            color: white !important;
            padding: 8px 18px !important;
            border-radius: 14px !important;
            cursor: pointer;
            font-size: 15px !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
            outline: none;
        }

        .nav-btn-user:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            transform: translateY(-1px);
        }

        .user-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid rgba(255, 255, 255, 0.8);
        }

        /* Force position and z-index on navbar to show dropdown overlaying map */
        .navbar {
            position: relative !important;
            z-index: 10000 !important;
        }

        .user-dropdown-menu {
            position: absolute;
            top: 80px;
            right: 40px;
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
            border: 1px solid #e1e4e8;
            display: none;
            flex-direction: column;
            padding: 8px;
            z-index: 9999;
            transform: translateY(10px);
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body.dark .user-dropdown-menu {
            background: #1d2638;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            border-color: #2c3a54;
        }

        .user-dropdown-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
        }

        .user-dropdown-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 12px;
        }

        .user-dropdown-details {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            width: 100%;
        }

        .user-dropdown-username {
            font-size: 14px;
            font-weight: 600;
            color: #24292e;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0;
        }

        body.dark .user-dropdown-username {
            color: white;
        }

        .user-dropdown-email {
            font-size: 12px;
            color: #586069;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 1px 0 0 0;
        }

        body.dark .user-dropdown-email {
            color: #bfc9d8;
        }

        .user-dropdown-divider {
            height: 1px;
            background: #e1e4e8;
            margin: 6px 0;
        }

        body.dark .user-dropdown-divider {
            background: #2c3a54;
        }

        .user-dropdown-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .user-dropdown-item-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            color: #24292e;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.15s ease;
        }

        body.dark .user-dropdown-item-link {
            color: #bfc9d8;
        }

        .user-dropdown-item-link:hover {
            background: #f6f8fa;
            color: #5b43f3;
        }

        body.dark .user-dropdown-item-link:hover {
            background: rgba(95, 95, 255, 0.15);
            color: #a594ff;
        }

        .user-dropdown-item-link i {
            font-size: 15px;
            color: #6a737d;
            width: 16px;
            text-align: center;
        }

        body.dark .user-dropdown-item-link i {
            color: #8899b3;
        }

        .user-dropdown-logout-btn {
            border: none !important;
            background: transparent !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            font-size: 13px !important;
            color: #24292e !important;
            cursor: pointer !important;
            width: 100% !important;
            text-align: left !important;
            font-weight: 500 !important;
            transition: all 0.15s ease !important;
        }

        body.dark .user-dropdown-logout-btn {
            color: #bfc9d8 !important;
        }

        .user-dropdown-logout-btn:hover {
            background: #f6f8fa !important;
            color: #ff4757 !important;
        }

        body.dark .user-dropdown-logout-btn:hover {
            background: rgba(255, 71, 87, 0.12) !important;
            color: #ff6b81 !important;
        }

        .user-dropdown-logout-btn i {
            font-size: 15px !important;
            color: #6a737d !important;
            width: 16px !important;
            text-align: center !important;
        }

        body.dark .user-dropdown-logout-btn i {
            color: #8899b3 !important;
        }

        /* Mobile Adjustments for Scrollable Navbar */
        @media (max-width: 768px) {
            .user-dropdown-menu {
                top: 62px;
                right: 20px;
            }
            .nav-links {
                align-items: center;
            }
            .user-menu-container {
                flex-shrink: 0;
            }
            .nav-btn-login {
                padding: 8px 16px !important;
                font-size: 13px !important;
            }
            .nav-btn-user {
                padding: 6px 12px !important;
                font-size: 13px !important;
            }
        }

        /* Premium Auth Modals */
        .auth-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(18, 24, 38, 0.5);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 11000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .auth-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .auth-modal-content {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 420px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(18, 24, 38, 0.15);
            border: 1px solid #e2e8f0;
            position: relative;
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        body.dark .auth-modal-content {
            background: #1d2638;
            border-color: #2c3a54;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .auth-modal-overlay.active .auth-modal-content {
            transform: scale(1);
        }

        .auth-modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: transparent;
            border: none;
            font-size: 24px;
            color: #64748b;
            cursor: pointer;
            transition: color 0.2s;
        }

        body.dark .auth-modal-close {
            color: #bfc9d8;
        }

        .auth-modal-close:hover {
            color: #ff4757;
        }

        .auth-modal-header-section {
            text-align: center;
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .auth-modal-avatar-large {
            display: flex;
            justify-content: center;
            margin-bottom: 12px;
        }

        .auth-modal-icon-large {
            font-size: 32px;
            color: #5b43f3;
            margin-bottom: 12px;
        }

        body.dark .auth-modal-icon-large {
            color: #a594ff;
        }

        .auth-modal-header-section h3 {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 4px 0;
        }

        body.dark .auth-modal-header-section h3 {
            color: white;
        }

        .auth-modal-header-section p {
            font-size: 13px;
            color: #64748b;
            margin: 0;
        }

        body.dark .auth-modal-header-section p {
            color: #bfc9d8;
        }

        .auth-modal-body {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .profile-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }

        body.dark .profile-info-row {
            background: #151b26;
            border-color: #2c3a54;
        }

        .profile-info-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }

        body.dark .profile-info-label {
            color: #bfc9d8;
        }

        .profile-info-value {
            font-size: 13px;
            color: #1e293b;
            font-weight: 600;
        }

        body.dark .profile-info-value {
            color: white;
        }

        .settings-form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .settings-form-group label {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            margin: 0;
        }

        body.dark .settings-form-group label {
            color: #bfc9d8;
        }

        .settings-form-group select {
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            font-size: 13px;
            outline: none;
            background: white;
            color: #1e293b;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        body.dark .settings-form-group select {
            background: #151b26;
            border-color: #2c3a54;
            color: white;
        }

        .settings-form-group select:focus {
            border-color: #5b43f3;
        }

        .settings-save-btn {
            margin-top: 10px;
            border: none;
            background: #5b43f3;
            color: white;
            padding: 12px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s, transform 0.1s;
        }

        .settings-save-btn:hover {
            background: #4a34d4;
        }

        .settings-save-btn:active {
            transform: scale(0.98);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'auth-shared-styles';
    styleEl.innerText = styles;
    document.head.appendChild(styleEl);
}

/**
 * Dynamically injects the HTML markup for Profile and Settings modals.
 */
function injectAuthModals() {
    if (document.getElementById('profileModal')) return;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <div class="auth-modal-overlay" id="profileModal">
            <div class="auth-modal-content">
                <button class="auth-modal-close" onclick="closeAuthModal('profileModal')">&times;</button>
                <div class="auth-modal-header-section">
                    <div class="auth-modal-avatar-large" id="profileAvatarContainer"></div>
                    <h3 id="profileModalTitleName">Your Profile</h3>
                    <p>Smart Route Finder Account Details</p>
                </div>
                <div class="auth-modal-body">
                    <div class="profile-info-row">
                        <span class="profile-info-label">Full Name</span>
                        <span class="profile-info-value" id="profileValName">-</span>
                    </div>
                    <div class="profile-info-row">
                        <span class="profile-info-label">Email Address</span>
                        <span class="profile-info-value" id="profileValEmail">-</span>
                    </div>
                    <div class="profile-info-row">
                        <span class="profile-info-label">Sign-in Provider</span>
                        <span class="profile-info-value" id="profileValProvider">Email & Password</span>
                    </div>
                    <div class="profile-info-row">
                        <span class="profile-info-label">Account Status</span>
                        <span class="profile-info-value" style="color: #20b26c; font-weight: 600;"><i class="fa-solid fa-circle-check" style="margin-right: 4px;"></i>Active</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="auth-modal-overlay" id="settingsModal">
            <div class="auth-modal-content">
                <button class="auth-modal-close" onclick="closeAuthModal('settingsModal')">&times;</button>
                <div class="auth-modal-header-section">
                    <div class="auth-modal-icon-large">
                        <i class="fa-solid fa-gear"></i>
                    </div>
                    <h3>Account Settings</h3>
                    <p>Customize your Route Finder experience</p>
                </div>
                <div class="auth-modal-body">
                    <div class="settings-form-group">
                        <label for="settingsDefaultStart">Default Starting City</label>
                        <select id="settingsDefaultStart" onchange="saveSetting('defaultStartCity', this.value)">
                            <option value="">None (Select on map)</option>
                        </select>
                    </div>
                    <div class="settings-form-group" style="margin-top: 10px;">
                        <label for="settingsTheme">Default Theme Mode</label>
                        <select id="settingsTheme" onchange="applySettingsTheme(this.value)">
                            <option value="system">Follow System Preferences</option>
                            <option value="light">Always Light Mode</option>
                            <option value="dark">Always Dark Mode</option>
                        </select>
                    </div>
                    <div class="settings-form-group" style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <label style="margin-bottom: 2px;">Enable Toast Notifications</label>
                            <p style="font-size: 11px; color: #64748b; margin: 0;">Show success and info messages</p>
                        </div>
                        <input type="checkbox" id="settingsToasts" checked onchange="saveSetting('enableToasts', this.checked)" style="width: 18px; height: 18px; cursor: pointer;">
                    </div>
                    <button class="settings-save-btn" onclick="closeAuthModal('settingsModal')">Done</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Populate default values
    setTimeout(() => {
        const startSelect = document.getElementById('settingsDefaultStart');
        if (startSelect && typeof cities !== 'undefined') {
            startSelect.innerHTML = '<option value="">None (Select on map)</option>';
            Object.keys(cities).sort().forEach(city => {
                const displayName = city.replace(/([A-Z])/g, ' $1').trim();
                startSelect.innerHTML += `<option value="${city}">${displayName}</option>`;
            });
            const savedStart = localStorage.getItem('setting_defaultStartCity');
            if (savedStart) startSelect.value = savedStart;
        }

        const savedToasts = localStorage.getItem('setting_enableToasts');
        const checkbox = document.getElementById('settingsToasts');
        if (checkbox) {
            checkbox.checked = savedToasts !== 'false';
        }

        const savedThemeVal = localStorage.getItem('setting_themeMode') || 'system';
        const themeSelect = document.getElementById('settingsTheme');
        if (themeSelect) {
            themeSelect.value = savedThemeVal;
        }
    }, 200);
}

/**
 * Opens an authentication or profile modal.
 */
function openAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'profileModal') {
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
            const user = JSON.parse(currentUserStr);
            document.getElementById('profileValName').innerText = user.name;
            document.getElementById('profileValEmail').innerText = user.email;
            document.getElementById('profileModalTitleName').innerText = user.name;
            document.getElementById('profileValProvider').innerText = user.provider === 'google' ? 'Google OAuth' : 'Email & Password';
            
            const avatarContainer = document.getElementById('profileAvatarContainer');
            if (avatarContainer) {
                avatarContainer.innerHTML = getAvatarSvg(user.name, 64);
            }
        }
    }

    modal.classList.add('active');
}

/**
 * Closes an active modal.
 */
function closeAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Saves a setting key/value pair in localStorage.
 */
function saveSetting(key, val) {
    localStorage.setItem(`setting_${key}`, val);
    if (typeof showToast === 'function' && localStorage.getItem('setting_enableToasts') !== 'false') {
        showToast("Settings updated successfully!", "success");
    }
}

/**
 * Dynamic theme settings application.
 */
function applySettingsTheme(mode) {
    localStorage.setItem('setting_themeMode', mode);
    let themeToApply = 'light';
    
    if (mode === 'system') {
        themeToApply = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    } else {
        themeToApply = mode;
    }
    
    if (themeToApply === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }

    if (typeof showToast === 'function' && localStorage.getItem('setting_enableToasts') !== 'false') {
        showToast(`Theme synced: ${themeToApply.toUpperCase()}`, "success");
    }
}

// Preselect start city if set in settings
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const savedStart = localStorage.getItem('setting_defaultStartCity');
        if (savedStart) {
            const fromSelected = document.getElementById('fromSelectedText');
            const fromInput = document.getElementById('fromCity');
            if (fromSelected && fromInput) {
                const displayName = savedStart.replace(/([A-Z])/g, ' $1').trim();
                fromSelected.innerText = displayName;
                fromInput.value = savedStart;
            }
        }
    }, 400);
});
