// Обработчик мобильного меню
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.remove('active');
    });
});

// Показ сообщения
function showMessage() {
    const messages = [
        "Отличная работа!",
        "Flask - это круто!",
        "Вы создали свой сайт!",
        "JavaScript работает!",
        "Продолжайте в том же духе!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage);
}

// Обработка формы
function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        showNotification('Пожалуйста, заполните все поля!', 'error');
        return;
    }
    
    showNotification('Сообщение отправлено! Мы свяжемся с вами скоро.', 'success');
    
    // Очистка формы
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}

// Показ уведомлений
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    
    // Устанавливаем цвет в зависимости от типа
    if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else if (type === 'success') {
        notification.style.background = '#2ecc71';
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
    }, 3000);
}

// Сохранение темы в localStorage
function saveTheme(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode);
}

// Загрузка темы из localStorage
function loadTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.style.background = '#f39c12';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.background = '#6a11cb';
    }
}

// Создание кнопки переключения темы
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.id = 'themeToggle';
    themeToggle.setAttribute('aria-label', 'Переключить тему');
    themeToggle.setAttribute('title', 'Переключить тему');
    
    themeToggle.addEventListener('click', function() {
        const isDarkMode = !document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.style.background = '#f39c12';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.style.background = '#6a11cb';
        }
        
        saveTheme(isDarkMode);
    });
    
    return themeToggle;
}

// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем кнопку переключения темы
    const themeToggle = createThemeToggle();
    document.body.appendChild(themeToggle);
    
    // Загружаем сохраненную тему
    loadTheme();
    
    // Анимация для карточек
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
    
    // Сохраняем тему при переходе между страницами
    window.addEventListener('beforeunload', function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        saveTheme(isDarkMode);
    });
});