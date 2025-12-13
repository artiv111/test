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

// Плавная прокрутка для якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
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
});

// Изменение темы (простой пример)
const themeToggle = document.createElement('button');
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
themeToggle.className = 'theme-toggle';
themeToggle.style.position = 'fixed';
themeToggle.style.bottom = '20px';
themeToggle.style.left = '20px';
themeToggle.style.background = '#6a11cb';
themeToggle.style.color = 'white';
themeToggle.style.border = 'none';
themeToggle.style.borderRadius = '50%';
themeToggle.style.width = '50px';
themeToggle.style.height = '50px';
themeToggle.style.fontSize = '1.2rem';
themeToggle.style.cursor = 'pointer';
themeToggle.style.zIndex = '1000';
themeToggle.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.style.background = '#f39c12';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.background = '#6a11cb';
    }
});

// Добавляем кнопку переключения темы на страницу
document.body.appendChild(themeToggle);

// Добавляем стили для темной темы
const darkModeStyles = `
    body.dark-mode {
        background-color: #1a1a1a;
        color: #ffffff;
    }
    
    body.dark-mode .hero,
    body.dark-mode .feature-card,
    body.dark-mode .page-content {
        background-color: #2d2d2d;
        color: #ffffff;
    }
    
    body.dark-mode .nav-link {
        color: #ffffff;
    }
    
    body.dark-mode .form-group input,
    body.dark-mode .form-group textarea {
        background-color: #3d3d3d;
        color: #ffffff;
        border-color: #555;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);