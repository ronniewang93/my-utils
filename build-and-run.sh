#!/bin/bash

echo "=== 构建前端应用 ==="
cd frontend
npm install
npm run build

echo "=== 复制前端构建文件到后端 ==="
mkdir -p ../backend/src/main/resources/static
cp -r build/* ../backend/src/main/resources/static/

echo "=== 构建并启动后端应用 ==="
cd ../backend
chmod +x gradlew
./gradlew clean build bootJar
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar