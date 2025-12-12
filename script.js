document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
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
        header.style.background = `linear-gradient(to right, ${colors[currentColorIndex]}, ${colors[(currentColorIndex + 1) % colors.length]})`;
        
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
        header.style.background = 'linear-gradient(to right, #2575fc, #6a11cb)';
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
    
    // Инициализация
    function init() {
        updateTime();
        updateServerInfo();
        
        // Обновление времени каждую секунду
        setInterval(updateTime, 1000);
        
        // Добавляем обработчики событий
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
        
        console.log('Сайт успешно загружен!');
    }
    
    // Запуск инициализации
    init();
});