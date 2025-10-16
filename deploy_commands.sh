#!/bin/bash

# Команды для обновления фронта на сервере
echo "=== Обновление фронта на сервере ==="
echo ""

echo "🔗 1. ПОДКЛЮЧЕНИЕ К СЕРВЕРУ:"
echo "   ssh root@84.32.51.60"
echo "   При первом подключении введите: yes"
echo "   Пароль: bND3p7u1"
echo ""

echo "📁 2. ПЕРЕХОД В ДИРЕКТОРИЮ ПРОЕКТА:"
echo "   cd .."
echo "   cd opt/projects"
echo "   cd logistic"
echo ""

echo "🔄 3. ОБНОВЛЕНИЕ КОДА С GIT:"
echo "   git pull"
echo ""

echo "🐳 4. ПЕРЕХОД К DOCKER-COMPOSE:"
echo "   cd .."
echo ""

echo "🔨 5. ПЕРЕСБОРКА ФРОНТА:"
echo "   docker compose up -d --build web"
echo ""

echo "✅ ГОТОВО! Админ панель должна работать корректно."
echo ""

echo "📋 ПОЛНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ КОМАНД:"
echo "ssh root@84.32.51.60"
echo "cd .."
echo "cd opt/projects"
echo "cd logistic"
echo "git pull"
echo "cd .."
echo "docker compose up -d --build web"
