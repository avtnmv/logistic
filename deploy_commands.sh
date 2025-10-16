#!/bin/bash

# Команды для обновления фронта на сервере
echo "=== Обновление фронта на сервере ==="

# 1. Подключение к серверу (выполнить вручную)
echo "1. Выполните вручную: ssh root@84.32.51.60"
echo "   При первом подключении: yes + пароль bND3p7u1"
echo ""

# 2. Переход в директорию проекта
echo "2. Команды для выполнения на сервере:"
echo "   cd .."
echo "   cd opt/projects"
echo "   cd logistic"
echo ""

# 3. Обновление с git
echo "3. Обновление кода:"
echo "   git pull"
echo ""

# 4. Выход на уровень docker-compose
echo "4. Переход к docker-compose:"
echo "   cd .."
echo ""

# 5. Пересборка фронта
echo "5. Пересборка фронта:"
echo "   docker compose up -d --build web"
echo ""

echo "=== Готово! ==="
