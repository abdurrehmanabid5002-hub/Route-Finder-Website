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
    
    // Handle closing dropdown on outside clicks
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('userDropdownMenu');
        if (dropdown && dropdown.classList.contains('active')) {
            if (!dropdown.contains(e.target) && !e.target.closest('.nav-btn-user')) {
                dropdown.classList.remove('active');
            }
        }
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
                <div class="user-dropdown-info">
                    <p class="user-dropdown-name">${user.name}</p>
                    <p class="user-dropdown-email">${user.email}</p>
                </div>
                <div class="user-dropdown-divider"></div>
                <button class="user-dropdown-item" onclick="logoutUser()">
                    <i class="fa-solid fa-sign-out-alt"></i>
                    Sign Out
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
            width: 250px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(91, 67, 243, 0.12);
            display: none;
            flex-direction: column;
            padding: 14px;
            z-index: 9999;
            transform: translateY(12px);
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        body.dark .user-dropdown-menu {
            background: #1d2638;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            border: 1px solid #2c3a54;
        }

        .user-dropdown-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
        }

        .user-dropdown-info {
            padding: 4px 8px 8px 8px;
        }

        .user-dropdown-name {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        body.dark .user-dropdown-name {
            color: white;
        }

        .user-dropdown-email {
            font-size: 12px;
            color: #64748b;
            margin: 3px 0 0 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        body.dark .user-dropdown-email {
            color: #bfc9d8;
        }

        .user-dropdown-divider {
            height: 1px;
            background: #f1f5f9;
            margin: 8px 0;
        }

        body.dark .user-dropdown-divider {
            background: #2c3a54;
        }

        .user-dropdown-item {
            border: none !important;
            background: transparent !important;
            color: #334155 !important;
            padding: 10px 12px !important;
            border-radius: 10px !important;
            cursor: pointer;
            font-size: 14px !important;
            text-align: left !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            width: 100% !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
        }

        body.dark .user-dropdown-item {
            color: #bfc9d8 !important;
        }

        .user-dropdown-item:hover {
            background: #f1f5f9 !important;
            color: #5b43f3 !important;
        }

        body.dark .user-dropdown-item:hover {
            background: rgba(95, 95, 255, 0.15) !important;
            color: #a594ff !important;
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
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'auth-shared-styles';
    styleEl.innerText = styles;
    document.head.appendChild(styleEl);
}
