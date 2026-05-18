// auth.js - Общая система авторизации для всех страниц

// Состояние пользователя с ролями
let userState = {
    isLoggedIn: false,
    userName: '',
    userLogin: '',
    userInitials: '',
    role: 'guest', // 'guest', 'user', 'admin'
    permissions: [],
    isAdmin: false // Добавляем для совместимости с admin.html
};

// Администратор, прописанный в коде (НЕЛЬЗЯ ЗАРЕГИСТРИРОВАТЬ НОВОГО!)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123', // пароль администратора
    role: 'admin',
    name: 'Администратор Системы',
    initials: 'АС',
    permissions: ['all']
};

// Разрешения для ролей
const ROLE_PERMISSIONS = {
    guest: ['view_public', 'view_services'],
    user: ['view_public', 'view_services', 'book_service', 'view_profile'],
    admin: ['all', 'publish_vk', 'manage_users', 'view_admin_panel']
};

// Функция для получения данных пользователя из базы
function getUserData() {
    if (!userState.isLoggedIn) return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === userState.userLogin);
    
    if (user) {
        return {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            email: user.email || user.username || '',
            ...user
        };
    }
    return null;
}

// Загрузка состояния из localStorage
function loadUserState() {
    const saved = localStorage.getItem('userState');
    if (saved) {
        const parsed = JSON.parse(saved);
        userState = { ...userState, ...parsed };
        updatePermissions();
    }
}

// Сохранение состояния в localStorage
function saveUserState() {
    localStorage.setItem('userState', JSON.stringify(userState));
}

// Обновление разрешений на основе роли
function updatePermissions() {
    userState.permissions = ROLE_PERMISSIONS[userState.role] || [];
    userState.isAdmin = userState.role === 'admin'; // Обновляем isAdmin
}

// Проверка прав
function hasPermission(permission) {
    return userState.permissions.includes('all') || userState.permissions.includes(permission);
}

// Проверка на администратора
function isAdmin() {
    return userState.role === 'admin' && userState.isLoggedIn;
}

// Проверка на обычного пользователя
function isUser() {
    return userState.role === 'user' && userState.isLoggedIn;
}

// Проверка на гостя
function isGuest() {
    return !userState.isLoggedIn || userState.role === 'guest';
}

// Инициализация шапки на всех страницах
function initHeader() {
    loadUserState();
    renderAuthSection();
    setupMobileMenu();
    updateNavigationVisibility(); // Обновляем видимость навигации
    
    // Проверяем права для админских страниц
    checkAdminPages();
}

// Проверка доступа к админским страницам
function checkAdminPages() {
    // Определяем текущую страницу
    const currentPage = window.location.pathname.split('/').pop();
    const adminPages = ['news_public.html', 'admin.html'];
    
    if (adminPages.includes(currentPage)) {
        // Для admin.html проверяем view_admin_panel
        if (currentPage === 'admin.html' && !hasPermission('view_admin_panel')) {
            showAccessDeniedScreen();
            return false;
        }
        // Для news_public.html проверяем publish_vk
        if (currentPage === 'news_public.html' && !hasPermission('publish_vk')) {
            showAccessDeniedScreen();
            return false;
        }
    }
    return true;
}

// Экран блокировки для не-админов
function showAccessDeniedScreen() {
    // Проверяем, не показывается ли уже экран блокировки
    if (document.querySelector('.access-denied-screen')) return;
    
    // Сохраняем оригинальное содержимое
    const originalBody = document.body.innerHTML;
    localStorage.setItem('originalBody', originalBody);
    
    // Добавляем экран блокировки
    document.body.innerHTML = `
        <div class="access-denied-screen" style="
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #326BF6 0%, #ff6b35 100%);
            padding: 20px;
            font-family: Arial, sans-serif;
        ">
            <div style="
                background: white;
                padding: 50px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 100%;
                text-align: center;
            ">
                <div style="font-size: 80px; color: #dc3545; margin-bottom: 20px;">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h1 style="color: #333; margin-bottom: 20px; font-size: 28px;">Административный доступ</h1>
                <p style="color: #666; margin-bottom: 30px; font-size: 18px; line-height: 1.5;">
                    ${userState.isLoggedIn 
                        ? 'У вас недостаточно прав для доступа к этой странице. Требуются права администратора.' 
                        : 'Эта страница доступна только администраторам системы.'}
                </p>
                
                ${!userState.isLoggedIn ? `
                <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">Учетные данные администратора:</h3>
                    <div style="text-align: left; background: white; padding: 15px; border-radius: 8px; border: 2px dashed #ddd;">
                        <p style="margin: 10px 0; font-size: 16px;"><strong>Логин:</strong> <code style="background: #f1f1f1; padding: 2px 6px; border-radius: 4px;">admin</code></p>
                        <p style="margin: 10px 0; font-size: 16px;"><strong>Пароль:</strong> <code style="background: #f1f1f1; padding: 2px 6px; border-radius: 4px;">admin123</code></p>
                    </div>
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.location.href='index.html'" style="
                        background: #326BF6;
                        color: white;
                        padding: 12px 30px;
                        border-radius: 25px;
                        text-decoration: none;
                        font-weight: 600;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s;
                        border: none;
                        cursor: pointer;
                        font-size: 16px;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <i class="fas fa-home"></i> На главную
                    </button>
                    
                    ${!userState.isLoggedIn ? `
                    <button onclick="window.location.href='login.html'" style="
                        background: #ff6b35;
                        color: white;
                        padding: 12px 30px;
                        border-radius: 25px;
                        text-decoration: none;
                        font-weight: 600;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s;
                        border: none;
                        cursor: pointer;
                        font-size: 16px;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.2)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <i class="fas fa-sign-in-alt"></i> Войти как администратор
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Добавляем Font Awesome если его нет
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }
}

// Восстановление оригинального содержимого
function restoreOriginalPage() {
    const originalBody = localStorage.getItem('originalBody');
    if (originalBody) {
        document.body.innerHTML = originalBody;
        localStorage.removeItem('originalBody');
        // Повторно инициализируем систему
        initHeader();
    }
}

// Обновление видимости навигационных ссылок
function updateNavigationVisibility() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.toLowerCase();
        
        // Скрываем "Публикация" для гостей и пользователей (только для админов)
        if ((href && href.includes('news_public.html')) || 
            (text.includes('публикация') && href && href.includes('news'))) {
            if (isAdmin()) {
                link.style.display = 'flex';
                link.style.alignItems = 'center';
                link.style.gap = '8px';
            } else {
                link.style.display = 'none';
            }
        }
        
        // Показываем "Админ-панель" только для админов
        if ((href && href.includes('admin.html')) || text.includes('админ')) {
            if (isAdmin()) {
                link.style.display = 'flex';
                link.style.alignItems = 'center';
                link.style.gap = '8px';
            } else {
                link.style.display = 'none';
            }
        }
    });
}

// Рендер секции авторизации
function renderAuthSection() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;
    
    if (userState.isLoggedIn) {
        // Добавляем бейдж роли
        const roleBadge = userState.role === 'admin' ? 
            `<span class="role-badge admin"><i class="fas "></i> Админ</span>` : 
            `<span class="role-badge user"><i class="fas fa-user"></i> Пользователь</span>`;
        
        authSection.innerHTML = `
            <div class="user-profile" id="user-profile">
                <div class="user-avatar" style="background: ${userState.role === 'admin' ? '#dc3545' : '#dc3545'};">
                    ${userState.userInitials}
                    ${userState.role === 'admin' ? '<div class=""><i class="fas "></i></div>' : ''}
                </div>
                <div class="user-info">
                    <div class="user-name">${userState.userName}</div>
                    <div class="user-role">${roleBadge}</div>
                </div>
                <div class="user-menu" id="user-menu">
                    ${hasPermission('view_profile') ? `
                    <a href="profile.html" class="user-menu-item">
                        <i class="fas fa-user"></i> Мой профиль
                    </a>
                    ` : ''}
                    ${hasPermission('publish_vk') ? `
                    <a href="news_public.html" class="user-menu-item admin-only">
                        <i class="fab fa-vk"></i> Публикация ВК
                    </a>
                    ` : ''}
                    ${hasPermission('view_admin_panel') ? `
                    <a href="admin.html" class="user-menu-item admin-only">
                        <i class="fas fa-cog"></i> Админ-панель
                    </a>
                    ` : ''}
                    <div class="menu-divider"></div>
                    <button class="user-menu-item logout-btn" onclick="AuthSystem.logout()">
                        <i class="fas fa-sign-out-alt"></i> Выйти
                    </button>
                </div>
            </div>
        `;

        // Обработчики для меню пользователя
        const userProfile = document.getElementById('user-profile');
        const userMenu = document.getElementById('user-menu');
        
        if (userProfile && userMenu) {
            userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });

            document.addEventListener('click', function() {
                userMenu.classList.remove('show');
            });
        }
    } else {
        authSection.innerHTML = `
            <div class="auth-buttons">
                <a href="login.html" class="btn btn-small">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </a>
                <a href="register.html" class="btn btn-small btn-outline">
                    <i class="fas fa-user-plus"></i> Регистрация
                </a>
            </div>
        `;
    }
    
    // Обновляем навигацию после рендера
    setTimeout(updateNavigationVisibility, 100);
}

// Мобильное меню
function setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenu && navContainer) {
        mobileMenu.addEventListener('click', function() {
            navContainer.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!navContainer.contains(e.target) && !mobileMenu.contains(e.target)) {
                navContainer.classList.remove('show');
            }
        });
    }
}

// Функция входа
function login(username, password) {
    // Проверка на администратора
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        userState.isLoggedIn = true;
        userState.userLogin = ADMIN_CREDENTIALS.username;
        userState.userName = ADMIN_CREDENTIALS.name;
        userState.userInitials = ADMIN_CREDENTIALS.initials;
        userState.role = ADMIN_CREDENTIALS.role;
        updatePermissions();
        
        saveUserState();
        return { success: true, role: 'admin' };
    }
    
    // Проверка обычных пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        userState.isLoggedIn = true;
        userState.userLogin = username;
        userState.userName = user.name || user.username;
        userState.userInitials = user.initials || (user.name ? user.name.split(' ').map(n => n[0]).join('') : username.charAt(0).toUpperCase());
        userState.role = 'user'; // Все обычные пользователи получают роль 'user'
        updatePermissions();
        
        saveUserState();
        return { success: true, role: 'user' };
    }
    
    return { success: false, message: 'Неверный логин или пароль' };
}

// Функция выхода
function logout() {
    userState.isLoggedIn = false;
    userState.userName = '';
    userState.userLogin = '';
    userState.userInitials = '';
    userState.role = 'guest';
    userState.isAdmin = false;
    userState.permissions = [];
    
    saveUserState();
    renderAuthSection();
    updateNavigationVisibility();
    showNotification('Вы успешно вышли из системы', 'info');
    
    // Перенаправление на главную страницу
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop();
        if (['news_public.html', 'admin.html'].includes(currentPage)) {
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Регистрация нового пользователя
function register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверяем, существует ли пользователь
    if (users.find(u => u.username === userData.username)) {
        return { success: false, message: 'Пользователь с таким логином уже существует' };
    }
    
    // Проверяем, не пытаемся ли зарегистрировать администратора
    if (userData.username === 'admin') {
        return { success: false, message: 'Нельзя зарегистрировать пользователя с логином "admin"' };
    }
    
    // Создаем нового пользователя
    const newUser = {
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString(),
        initials: (userData.firstName ? userData.firstName[0] : '') + (userData.lastName ? userData.lastName[0] : '')
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Регистрация успешна' };
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: Arial, sans-serif;
        max-width: 400px;
    `;
    
    const icon = type === 'success' ? 'check' : 
                 type === 'error' ? 'exclamation' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}-circle" style="font-size: 20px;"></i>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0 0 0 10px;">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Защита страницы публикации ВК
function protectVKPage() {
    return hasPermission('publish_vk');
}

// Проверка доступа при записи на услугу
function checkServiceAccess() {
    if (isGuest()) {
        showNotification('Для записи на услугу необходимо авторизоваться', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }, 1500);
        return false;
    }
    return true;
}

// Экспорт публичных методов для использования на других страницах
window.AuthSystem = {
    login: login,
    logout: logout,
    register: register,
    isLoggedIn: () => userState.isLoggedIn,
    getUser: () => ({ ...userState }),
    getUserData: getUserData,
    hasPermission: hasPermission,
    isAdmin: isAdmin,
    isUser: isUser,
    isGuest: isGuest,
    showNotification: showNotification,
    protectVKPage: protectVKPage,
    checkServiceAccess: checkServiceAccess,
    showAccessDeniedScreen: showAccessDeniedScreen,
    restoreOriginalPage: restoreOriginalPage
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    
    // Добавляем стили для бейджей ролей
    const style = document.createElement('style');
    style.textContent = `
        .role-badge {
            font-size: 10px !important;
            padding: 3px 10px !important;
            border-radius: 12px !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            margin-top: 2px !important;
        }
        .role-badge.admin {
            background: linear-gradient(135deg, #dc3545, #c82333) !important;
            color: white !important;
            border: 1px solid #ff6b6b !important;
        }
        .role-badge.user {
            background: linear-gradient(135deg, #28a745, #218838) !important;
            color: white !important;
            border: 1px solid #6fcf97 !important;
        }
        .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .user-name {
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
        }
        .user-role {
            font-size: 10px;
        }
        .admin-crown {
            position: absolute;
            bottom: -2px;
            right: -2px;
            background: #ffc107;
            color: #000;
            font-size: 8px;
            padding: 2px 4px;
            border-radius: 50%;
            border: 1px solid white;
        }
        .admin-only {
            position: relative;
        }
        .admin-only::before {
            content: "ADMIN";
            position: absolute;
            top: -8px;
            right: 5px;
            background: #dc3545;
            color: white;
            font-size: 8px;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: bold;
        }
        .menu-divider {
            height: 1px;
            background: #e9ecef;
            margin: 5px 0;
        }
        .logout-btn {
            color: #dc3545 !important;
            width: 100%;
            text-align: left;
        }
        .logout-btn:hover {
            background: #fff5f5 !important;
        }
        /* Стили для админских пунктов в навигации */
        nav a.admin-only {
            position: relative;
            background: rgba(220, 53, 69, 0.1) !important;
            border: 1px solid rgba(220, 53, 69, 0.3) !important;
        }
        nav a.admin-only:hover {
            background: rgba(220, 53, 69, 0.2) !important;
        }
        nav a.admin-only i {
            color: #dc3545 !important;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            padding: 15px 20px !important;
            border-radius: 10px !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
            z-index: 3000 !important;
            animation: slideIn 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            font-family: Arial, sans-serif !important;
            max-width: 400px !important;
        }
    `;
    document.head.appendChild(style);
});

// Тестовые функции для проверки системы
function testAdmin() {
    const result = login('admin', 'admin123');
    if (result.success) {
        showNotification('✅ Успешный вход как администратор!', 'success');
        setTimeout(() => location.reload(), 1000);
    } else {
        showNotification('❌ Ошибка входа: ' + result.message, 'error');
    }
}

function testUser() {
    // Создаем тестового пользователя если его нет
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.username === 'testuser')) {
        users.push({
            username: 'testuser',
            password: '123456',
            name: 'Тестовый Пользователь',
            firstName: 'Тестовый',
            lastName: 'Пользователь',
            phone: '+7 (999) 999-99-99',
            email: 'test@example.com',
            initials: 'ТП'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    const result = login('testuser', '123456');
    if (result.success) {
        showNotification('✅ Успешный вход как пользователь!', 'success');
        setTimeout(() => location.reload(), 1000);
    } else {
        showNotification('❌ Ошибка входа: ' + result.message, 'error');
    }
}

function testLogout() {
    logout();
}

// Добавляем тестовые функции в глобальную область видимости для тестирования
if (window.location.pathname.includes('test')) {
    window.testAdmin = testAdmin;
    window.testUser = testUser;
    window.testLogout = testLogout;
}