document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const themeToggle = document.getElementById('themeToggle');
    const themeStatus = document.getElementById('themeStatus');
    const currentThemeSpan = document.getElementById('currentTheme');
    const themeOptions = document.querySelectorAll('.theme-option');
    const htmlElement = document.documentElement;
    
    // Элементы для других функций
    const changeColorBtn = document.getElementById('changeColorBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const resetBtn = document.getElementById('resetBtn');
    const incrementBtn = document.getElementById('incrementBtn');
    const counterValue = document.getElementById('counterValue');
    const itemList = document.getElementById('itemList');
    const currentTime = document.getElementById('currentTime');
    const serverInfo = document.getElementById('serverInfo');
    
    // Переменные состояния
    let counter = 0;
    let itemCount = 2;
    let colors = ['#6a11cb', '#2575fc', '#ff416c', '#ff4b2b', '#11998e', '#38ef7d'];
    let currentColorIndex = 0;
    
    // Функции для работы с темой
    function getStoredTheme() {
        return localStorage.getItem('theme') || 'auto';
    }
    
    function setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }
    
    function applyTheme(theme) {
        // Удаляем все предыдущие атрибуты темы
        htmlElement.removeAttribute('data-theme');
        
        if (theme === 'dark' || theme === 'light') {
            htmlElement.setAttribute('data-theme', theme);
        } else {
            // Для авто-темы проверяем системные настройки
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                htmlElement.setAttribute('data-theme', 'dark');
            } else {
                htmlElement.setAttribute('data-theme', 'light');
            }
        }
        
        // Обновляем интерфейс
        updateThemeUI(theme);
    }
    
    function updateThemeUI(theme) {
        // Обновляем кнопку переключения
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Светлая тема';
            themeStatus.textContent = 'Тёмная тема активна';
            currentThemeSpan.textContent = 'тёмная';
        } else if (theme === 'light') {
            icon.className = 'fas fa-moon';
            text.textContent = 'Тёмная тема';
            themeStatus.textContent = 'Светлая тема активна';
            currentThemeSpan.textContent = 'светлая';
        } else {
            icon.className = 'fas fa-adjust';
            text.textContent = 'Авто тема';
            themeStatus.textContent = 'Авто-тема активна';
            currentThemeSpan.textContent = 'авто';
        }
        
        // Обновляем выбор в настройках темы
        themeOptions.forEach(option => {
            option.classList.remove('active');
            const checkIcon = option.querySelector('.check-icon');
            checkIcon.style.opacity = '0';
            
            if (option.dataset.theme === theme) {
                option.classList.add('active');
                checkIcon.style.opacity = '1';
            }
        });
        
        // Сохраняем тему
        setStoredTheme(theme);
    }
    
    function toggleTheme() {
        const current = getStoredTheme();
        let nextTheme;
        
        if (current === 'light') {
            nextTheme = 'dark';
        } else if (current === 'dark') {
            nextTheme = 'auto';
        } else {
            nextTheme = 'light';
        }
        
        applyTheme(nextTheme);
    }
    
    function selectTheme(theme) {
        applyTheme(theme);
    }
    
    // Обновление времени
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        currentTime.textContent = `${dateString}, ${timeString}`;
    }
    
    // Обновление информации о сервере
    function updateServerInfo() {
        serverInfo.textContent = `Хост: ${window.location.hostname}, Порт: ${window.location.port || '80'}`;
    }
    
    // Смена цвета заголовка
    function changeHeaderColor() {
        const header = document.querySelector('header');
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        const nextColorIndex = (currentColorIndex + 1) % colors.length;
        
        const currentTheme = getStoredTheme();
        if (currentTheme === 'dark') {
            // Для тёмной темы используем более тёмные цвета
            const darkColors = ['#302b63', '#0f0c29', '#8b0000', '#8b4513', '#006400', '#2e8b57'];
            header.style.background = `linear-gradient(to right, ${darkColors[currentColorIndex]}, ${darkColors[nextColorIndex]})`;
        } else {
            header.style.background = `linear-gradient(to right, ${colors[currentColorIndex]}, ${colors[nextColorIndex]})`;
        }
        
        // Анимация кнопки
        changeColorBtn.innerHTML = `<i class="fas fa-check"></i> Цвет изменен!`;
        setTimeout(() => {
            changeColorBtn.innerHTML = `<i class="fas fa-palette"></i> Сменить цвет`;
        }, 1000);
    }
    
    // Добавление элемента в список
    function addListItem() {
        itemCount++;
        const newItem = document.createElement('li');
        newItem.textContent = `Элемент ${itemCount}`;
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-10px)';
        
        itemList.appendChild(newItem);
        
        // Анимация появления
        setTimeout(() => {
            newItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 10);
        
        // Анимация кнопки
        addItemBtn.innerHTML = `<i class="fas fa-check"></i> Добавлено!`;
        setTimeout(() => {
            addItemBtn.innerHTML = `<i class="fas fa-plus"></i> Добавить элемент`;
        }, 1000);
    }
    
    // Сброс всего
    function resetAll() {
        // Сброс счетчика
        counter = 0;
        counterValue.textContent = counter;
        
        // Сброс списка
        itemList.innerHTML = '';
        itemCount = 0;
        
        // Добавляем начальные элементы
        for (let i = 1; i <= 2; i++) {
            itemCount++;
            const item = document.createElement('li');
            item.textContent = `Элемент ${itemCount}`;
            itemList.appendChild(item);
        }
        
        // Сброс цвета заголовка
        const header = document.querySelector('header');
        const currentTheme = getStoredTheme();
        if (currentTheme === 'dark') {
            header.style.background = 'linear-gradient(to right, #302b63, #0f0c29)';
        } else {
            header.style.background = 'linear-gradient(to right, #2575fc, #6a11cb)';
        }
        currentColorIndex = 0;
        
        // Анимация кнопки
        resetBtn.innerHTML = `<i class="fas fa-check"></i> Сброшено!`;
        setTimeout(() => {
            resetBtn.innerHTML = `<i class="fas fa-redo"></i> Сбросить`;
        }, 1000);
    }
    
    // Увеличение счетчика
    function incrementCounter() {
        counter++;
        counterValue.textContent = counter;
        
        // Анимация счетчика
        counterValue.style.transform = 'scale(1.3)';
        counterValue.style.color = '#ff416c';
        
        setTimeout(() => {
            counterValue.style.transform = 'scale(1)';
            counterValue.style.color = '#6a11cb';
        }, 300);
    }
    
    // Слушатель для системных изменений темы
    function setupThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        function handleSystemThemeChange(e) {
            const storedTheme = getStoredTheme();
            if (storedTheme === 'auto') {
                applyTheme('auto');
            }
        }
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
    
    // Инициализация
    function init() {
        // Применяем сохранённую тему
        const savedTheme = getStoredTheme();
        applyTheme(savedTheme);
        
        // Настраиваем слушатель системной темы
        setupThemeListener();
        
        // Инициализируем время и информацию о сервере
        updateTime();
        updateServerInfo();
        
        // Обновление времени каждую секунду
        setInterval(updateTime, 1000);
        
        // Добавляем обработчики событий для темы
        themeToggle.addEventListener('click', toggleTheme);
        
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                selectTheme(this.dataset.theme);
            });
        });
        
        // Добавляем обработчики событий для других функций
        changeColorBtn.addEventListener('click', changeHeaderColor);
        addItemBtn.addEventListener('click', addListItem);
        resetBtn.addEventListener('click', resetAll);
        incrementBtn.addEventListener('click', incrementCounter);
        
        // Добавляем эффект наведения на карточки
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        console.log('Сайт успешно загружен! Тема:', savedTheme);
    }
    
    // Запуск инициализации
    init();
});