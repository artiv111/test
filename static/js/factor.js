// Factor Page JavaScript - Исправленная версия
let clickCount = 0;
let complimentCount = 0;
let comboCount = 0;
let currentCombo = 0;
let lastClickTime = 0;
const COMBO_TIMEOUT = 2000; // 2 секунды для комбо
const achievements = [
    { id: 1, name: 'Первые 10 кликов', earned: false, threshold: 10 },
    { id: 2, name: '50 комплиментов', earned: false, threshold: 50 },
    { id: 3, name: 'Комбо 5', earned: false, threshold: 5 },
    { id: 4, name: 'Комбо 10', earned: false, threshold: 10 },
    { id: 5, name: '100 кликов', earned: false, threshold: 100 },
    { id: 6, name: 'Радужный мастер', earned: false },
    { id: 7, name: 'Огненный чемпион', earned: false },
    { id: 8, name: 'Золотой король', earned: false }
];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Factor page loaded');
    loadFactorStats();
    initializeAchievements();
    updateStats();
    
    // Загрузка сохраненных комплиментов
    const savedCompliments = JSON.parse(localStorage.getItem('recentCompliments') || '[]');
    savedCompliments.forEach(compliment => {
        addToRecentCompliments(compliment.text, compliment.type);
    });
    
    // Загрузка истории кликов
    const clickHistory = JSON.parse(localStorage.getItem('clickHistory') || '[]');
    clickCount = clickHistory.length;
    complimentCount = savedCompliments.length;
    updateStats();
    
    // Назначаем обработчик на кнопку
    const factorButton = document.getElementById('factorButton');
    if (factorButton) {
        factorButton.addEventListener('click', generateCompliment);
        console.log('Factor button event listener added');
    }
    
    // Обработка нажатия клавиши Space
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && window.location.pathname === '/factor') {
            event.preventDefault();
            generateCompliment();
        }
    });
    
    // Анимация кнопки при загрузке
    setTimeout(() => {
        if (factorButton) {
            factorButton.style.transform = 'scale(1.05)';
            factorButton.style.boxShadow = '0 0 30px rgba(106, 17, 203, 0.8)';
            setTimeout(() => {
                factorButton.style.transform = '';
                factorButton.style.boxShadow = '';
            }, 500);
        }
    }, 1000);
});

// Загрузка статистики из localStorage
function loadFactorStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('factorStats') || '{}');
        clickCount = stats.clickCount || 0;
        complimentCount = stats.complimentCount || 0;
        comboCount = stats.comboCount || 0;
        currentCombo = stats.currentCombo || 0;
    } catch (e) {
        console.error('Error loading factor stats:', e);
        // Сброс статистики при ошибке
        clickCount = 0;
        complimentCount = 0;
        comboCount = 0;
        currentCombo = 0;
    }
}

// Сохранение статистики в localStorage
function saveFactorStats() {
    const stats = {
        clickCount,
        complimentCount,
        comboCount,
        currentCombo,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('factorStats', JSON.stringify(stats));
}

// Инициализация достижений
function initializeAchievements() {
    try {
        const earnedAchievements = JSON.parse(localStorage.getItem('factorAchievements') || '[]');
        
        achievements.forEach(achievement => {
            achievement.earned = earnedAchievements.includes(achievement.id);
        });
        
        renderAchievements();
    } catch (e) {
        console.error('Error loading achievements:', e);
        // Сброс достижений при ошибке
        achievements.forEach(a => a.earned = false);
        renderAchievements();
    }
}

// Сохранение достижений
function saveAchievements() {
    const earnedIds = achievements.filter(a => a.earned).map(a => a.id);
    localStorage.setItem('factorAchievements', JSON.stringify(earnedIds));
}

// Отрисовка достижений
function renderAchievements() {
    const container = document.getElementById('achievementList');
    if (!container) return;
    
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${achievement.earned ? 'earned' : 'locked'}`;
        achievementElement.innerHTML = `
            <i class="fas ${achievement.earned ? 'fa-medal' : 'fa-lock'}"></i>
            <span>${achievement.name}</span>
            ${achievement.threshold ? `<small>(${achievement.threshold})</small>` : ''}
        `;
        container.appendChild(achievementElement);
    });
}

// Проверка достижений
function checkAchievements() {
    let newAchievements = false;
    
    achievements.forEach(achievement => {
        if (!achievement.earned) {
            if (achievement.threshold) {
                if (clickCount >= achievement.threshold || complimentCount >= achievement.threshold || comboCount >= achievement.threshold) {
                    achievement.earned = true;
                    newAchievements = true;
                    showAchievementNotification(achievement.name);
                }
            }
        }
    });
    
    if (newAchievements) {
        saveAchievements();
        renderAchievements();
    }
}

// Показать уведомление о достижении
function showAchievementNotification(achievementName) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <i class="fas fa-trophy"></i>
        <div>
            <strong>Достижение разблокировано!</strong>
            <p>${achievementName}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Обновление статистики на странице
function updateStats() {
    const clickElement = document.getElementById('clickCount');
    const complimentElement = document.getElementById('complimentCount');
    const comboElement = document.getElementById('comboCount');
    
    if (clickElement) clickElement.textContent = clickCount;
    if (complimentElement) complimentElement.textContent = complimentCount;
    if (comboElement) comboElement.textContent = comboCount;
    
    saveFactorStats();
}

// Получение комплимента с сервера
async function generateCompliment() {
    console.log('Generate compliment called');
    
    try {
        const response = await fetch('/api/get_compliment');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        clickCount++;
        complimentCount++;
        
        // Проверка комбо
        const now = Date.now();
        if (now - lastClickTime < COMBO_TIMEOUT) {
            currentCombo++;
            if (currentCombo > comboCount) {
                comboCount = currentCombo;
            }
        } else {
            currentCombo = 1;
        }
        lastClickTime = now;
        
        // Обновление статистики
        updateStats();
        
        // Проверка достижений
        checkAchievements();
        
        // Сохранение в историю кликов
        saveClickToHistory();
        
        // Отображение комплимента
        displayCompliment(data.compliment, 'normal');
        
        // Добавление в список недавних
        addToRecentCompliments(data.compliment, 'normal');
        
        // Эффект нажатия
        animateButton();
        
        // Случайный эффект конфетти (30% шанс)
        if (Math.random() < 0.3) {
            createConfetti();
        }
        
    } catch (error) {
        console.error('Ошибка при получении комплимента:', error);
        // Запасной комплимент
        const fallbackCompliments = ["Красава!", "Молодец!", "Лучший!", "Супер!", "Великолепно!"];
        const compliment = fallbackCompliments[Math.floor(Math.random() * fallbackCompliments.length)];
        displayCompliment(compliment, 'normal');
        addToRecentCompliments(compliment, 'normal');
        
        clickCount++;
        complimentCount++;
        updateStats();
    }
}

// Генерация специального комплимента
function generateSpecialCompliment(type) {
    console.log('Generate special compliment:', type);
    
    const specialCompliments = {
        rainbow: ["🌈 Радужная звезда!", "✨ Сияешь всеми цветами!", "🎨 Живописный гений!", "💫 Мультицветное чудо!"],
        fire: ["🔥 Огненная легенда!", "🔥 Горишь ярче всех!", "🔥 Неукротимая энергия!", "🌋 Вулкан таланта!"],
        gold: ["💰 Золотой стандарт!", "🏆 Бесценный друг!", "👑 Королевская особа!", "💎 Драгоценный человек!"]
    };
    
    const compliment = specialCompliments[type][Math.floor(Math.random() * specialCompliments[type].length)];
    
    clickCount++;
    complimentCount++;
    updateStats();
    
    // Разблокировка специальных достижений
    if (type === 'rainbow' && !achievements[5].earned) {
        achievements[5].earned = true;
        showAchievementNotification('Радужный мастер');
        saveAchievements();
        renderAchievements();
    } else if (type === 'fire' && !achievements[6].earned) {
        achievements[6].earned = true;
        showAchievementNotification('Огненный чемпион');
        saveAchievements();
        renderAchievements();
    } else if (type === 'gold' && !achievements[7].earned) {
        achievements[7].earned = true;
        showAchievementNotification('Золотой король');
        saveAchievements();
        renderAchievements();
    }
    
    displayCompliment(compliment, type);
    addToRecentCompliments(compliment, type);
    
    // Специальные эффекты
    if (type === 'rainbow') createRainbowEffect();
    if (type === 'fire') createFireEffect();
    if (type === 'gold') createGoldEffect();
    
    createConfetti();
}

// Отображение комплимента
function displayCompliment(text, type) {
    const display = document.getElementById('complimentsDisplay');
    if (!display) return;
    
    const complimentElement = document.createElement('div');
    complimentElement.className = `compliment ${type}`;
    complimentElement.textContent = text;
    
    // Случайная анимация
    const animations = ['bounce', 'pulse', 'rubberBand', 'tada'];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    complimentElement.style.animation = `${animation} 0.6s`;
    
    display.insertBefore(complimentElement, display.firstChild);
    
    // Ограничение количества отображаемых комплиментов
    const maxCompliments = 15;
    while (display.children.length > maxCompliments) {
        display.removeChild(display.lastChild);
    }
    
    // Автоудаление через 8 секунд
    setTimeout(() => {
        complimentElement.style.opacity = '0';
        complimentElement.style.transform = 'translateY(-20px) scale(0.9)';
        setTimeout(() => {
            if (complimentElement.parentNode) {
                complimentElement.parentNode.removeChild(complimentElement);
            }
        }, 500);
    }, 8000);
}

// Добавление в список недавних комплиментов
function addToRecentCompliments(text, type) {
    const list = document.getElementById('recentCompliments');
    if (!list) return;
    
    const item = document.createElement('li');
    item.className = type;
    item.innerHTML = `
        <i class="fas ${getIconForType(type)}"></i>
        <span>${text}</span>
    `;
    
    list.insertBefore(item, list.firstChild);
    
    // Ограничение списка
    const maxItems = 10;
    while (list.children.length > maxItems) {
        list.removeChild(list.lastChild);
    }
    
    // Сохранение в localStorage
    try {
        const saved = JSON.parse(localStorage.getItem('recentCompliments') || '[]');
        saved.unshift({ text, type, timestamp: new Date().toISOString() });
        if (saved.length > maxItems) saved.pop();
        localStorage.setItem('recentCompliments', JSON.stringify(saved));
    } catch (e) {
        console.error('Error saving compliment:', e);
    }
}

// Получение иконки для типа
function getIconForType(type) {
    switch(type) {
        case 'rainbow': return 'fa-rainbow';
        case 'fire': return 'fa-fire';
        case 'gold': return 'fa-crown';
        default: return 'fa-heart';
    }
}

// Сохранение клика в историю
function saveClickToHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('clickHistory') || '[]');
        history.push({
            timestamp: new Date().toISOString(),
            clickNumber: clickCount
        });
        localStorage.setItem('clickHistory', JSON.stringify(history));
    } catch (e) {
        console.error('Error saving click history:', e);
    }
}

// Анимация кнопки
function animateButton() {
    const button = document.getElementById('factorButton');
    if (!button) return;
    
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
    
    // Эффект пульсации
    const pulse = button.querySelector('.button-pulse');
    if (pulse) {
        pulse.style.animation = 'none';
        setTimeout(() => {
            pulse.style.animation = 'pulse 2s infinite';
        }, 10);
    }
}

// Создание эффекта конфетти
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiCount = 150;
    const confetti = [];
    
    // Создание конфетти
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * confettiCount,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    // Анимация конфетти
    let animationId;
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < confetti.length; i++) {
            const p = confetti[i];
            
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
            ctx.stroke();
            
            p.tiltAngle += p.tiltAngleIncrement;
            p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2;
            p.x += Math.sin(p.d);
            p.tilt = Math.sin(p.tiltAngle) * 15;
            
            if (p.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncrement: p.tiltAngleIncrement,
                    tiltAngle: p.tiltAngle
                };
            }
        }
        
        animationId = requestAnimationFrame(animateConfetti);
        
        // Остановка через 3 секунды
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 3000);
    }
    
    animateConfetti();
}

// Специальные эффекты
function createRainbowEffect() {
    const display = document.getElementById('complimentsDisplay');
    if (!display) return;
    
    display.style.background = 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff)';
    display.style.backgroundSize = '400% 400%';
    display.style.animation = 'rainbow 2s linear';
    
    setTimeout(() => {
        display.style.background = '';
        display.style.animation = '';
    }, 2000);
}

function createFireEffect() {
    const button = document.getElementById('factorButton');
    if (!button) return;
    
    button.style.boxShadow = '0 0 30px #ff3300, 0 0 60px #ff6600';
    button.style.background = 'linear-gradient(45deg, #ff3300, #ff6600, #ff9900)';
    
    setTimeout(() => {
        button.style.boxShadow = '';
        button.style.background = '';
    }, 1000);
}

function createGoldEffect() {
    document.querySelectorAll('.compliment').forEach(comp => {
        comp.style.color = '#ffd700';
        comp.style.textShadow = '0 0 10px #ffd700';
        
        setTimeout(() => {
            comp.style.color = '';
            comp.style.textShadow = '';
        }, 2000);
    });
}

// Экспортируем функции для использования в HTML
window.generateCompliment = generateCompliment;
window.generateSpecialCompliment = generateSpecialCompliment;