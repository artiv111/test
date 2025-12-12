import socket
import os
import webbrowser
from datetime import datetime

def handle_request(client_socket):
    """Обработка HTTP запроса"""
    request = client_socket.recv(1024).decode('utf-8')
    
    # Извлекаем путь из запроса
    lines = request.split('\n')
    if len(lines) > 0:
        parts = lines[0].split()
        if len(parts) > 1:
            path = parts[1]
        else:
            path = '/'
    else:
        path = '/'
    
    # Если путь корневой, используем index.html
    if path == '/':
        path = '/index.html'
    
    # Убираем начальный слеш
    file_path = path[1:] if path.startswith('/') else path
    
    # Логируем запрос
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {path}")
    
    # Определяем тип контента
    if file_path.endswith('.html'):
        content_type = 'text/html; charset=utf-8'
    elif file_path.endswith('.css'):
        content_type = 'text/css; charset=utf-8'
    elif file_path.endswith('.js'):
        content_type = 'application/javascript; charset=utf-8'
    else:
        content_type = 'text/plain; charset=utf-8'
    
    # Пытаемся прочитать файл
    try:
        with open(file_path, 'rb') as file:
            content = file.read()
        
        # Формируем HTTP ответ
        response = f"""HTTP/1.1 200 OK
Content-Type: {content_type}
Content-Length: {len(content)}
Connection: close

""".encode('utf-8') + content
    
    except FileNotFoundError:
        # Файл не найден
        error_msg = f"""<html>
<head><title>404 Not Found</title></head>
<body>
<h1>404 - File not found</h1>
<p>The requested file {path} was not found on this server.</p>
</body>
</html>""".encode('utf-8')
        
        response = f"""HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
Content-Length: {len(error_msg)}
Connection: close

""".encode('utf-8') + error_msg
    
    # Отправляем ответ
    client_socket.sendall(response)
    client_socket.close()

def main():
    HOST = 'localhost'
    PORT = 8080
    
    # Проверяем наличие файлов
    required_files = ["index.html", "style.css", "script.js"]
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print(f"Ошибка: отсутствуют файлы: {', '.join(missing_files)}")
        return
    
    # Создаем сокет
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    
    print("=" * 60)
    print(f"Сервер запущен на http://{HOST}:{PORT}")
    print("=" * 60)
    print("Файлы сайта:")
    for file in required_files:
        print(f"  • {file}")
    print("=" * 60)
    print("Нажмите Ctrl+C для остановки сервера")
    print("=" * 60)
    
    # Открываем браузер
    try:
        webbrowser.open(f"http://{HOST}:{PORT}")
    except:
        print(f"Откройте браузер и перейдите по адресу: http://{HOST}:{PORT}")
    
    # Основной цикл сервера
    try:
        while True:
            client_socket, addr = server_socket.accept()
            handle_request(client_socket)
    except KeyboardInterrupt:
        print("\nСервер остановлен")
    finally:
        server_socket.close()

if __name__ == "__main__":
    main()