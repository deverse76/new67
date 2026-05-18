// admin-check.js - Быстрая проверка прав администратора

// Проверяем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Если мы на странице публикации ВК, проверяем права
    if (window.location.pathname.includes('news.html')) {
        loadUserState();
        if (!hasPermission('publish_vk')) {
            // Создаем экран блокировки
            document.body.innerHTML = `
                <div style="
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #326BF6 0%, #ff6b35 100%);
                    padding: 20px;
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
                        <h1 style="color: #333; margin-bottom: 20px;">Административный доступ</h1>
                        <p style="color: #666; margin-bottom: 30px; font-size: 18px;">
                            Эта страница доступна только администраторам системы.
                        </p>
                        
                        <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                            <h3 style="color: #333; margin-bottom: 15px;">Учетные данные администратора:</h3>
                            <div style="text-align: left; background: white; padding: 15px; border-radius: 8px; border: 2px dashed #ddd;">
                                <p style="margin: 5px 0;"><strong>Логин:</strong> admin</p>
                                <p style="margin: 5px 0;"><strong>Пароль:</strong> admin123</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <a href="index.html" class="btn" style="
                                background: var(--primary);
                                color: white;
                                padding: 12px 30px;
                                border-radius: 25px;
                                text-decoration: none;
                                font-weight: 600;
                            ">
                                <i class="fas fa-home"></i> На главную
                            </a>
                            <a href="login.html" class="btn" style="
                                background: var(--secondary);
                                color: white;
                                padding: 12px 30px;
                                border-radius: 25px;
                                text-decoration: none;
                                font-weight: 600;
                            ">
                                <i class="fas fa-sign-in-alt"></i> Войти как администратор
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
});