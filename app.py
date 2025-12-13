from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Список комплиментов для Factor
COMPLIMENTS = [
    "Красава!",
    "Молодец!",
    "Лучший друг!",
    "Гений!",
    "Король!",
    "Босс!",
    "Легенда!",
    "Чемпион!",
    "Супер!",
    "Великолепно!",
    "Невероятно!",
    "Потрясающе!",
    "Бесподобно!",
    "Герой!",
    "Мастер!",
    "Профи!",
    "Умница!",
    "Звезда!",
    "Крутяк!",
    "Браво!",
    "Восхитительно!",
    "Идеально!",
    "Талант!",
    "Гуру!",
    "Великан!",
    "Титан!",
    "Божественно!",
    "Феноменально!",
    "Сенсационно!",
    "Эпично!"
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('index.html', page='about')

@app.route('/contact')
def contact():
    return render_template('index.html', page='contact')

@app.route('/factor')
def factor():
    return render_template('index.html', page='factor')

@app.route('/api/get_compliment')
def get_compliment():
    compliment = random.choice(COMPLIMENTS)
    return jsonify({
        'compliment': compliment,
        'total': len(COMPLIMENTS)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)