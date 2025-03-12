# My Utils

一个实用工具集合项目，包含番茄钟计时器等功能。项目采用前后端分离架构。

## 技术栈

### 后端
- Spring Boot 2.7.18
- Spring Data JPA
- H2 Database
- Java 15
- Gradle 8.6

### 前端
- React
- TypeScript
- CSS3

## 项目结构

```
my-utils/
├── backend/             # Spring Boot 后端项目
│   ├── src/            # 源代码
│   ├── build.gradle    # Gradle 构建配置
│   └── gradlew         # Gradle 包装器
│
└── frontend/           # React 前端项目
    ├── src/           # 源代码
    ├── public/        # 静态资源
    └── package.json   # npm 配置文件
```

## 安装和运行

### 前置要求
- Java 15 或更高版本
- Node.js 14 或更高版本
- Gradle 8.6 或更高版本

### 后端

1. 进入后端目录：
```bash
cd backend
```

2. 运行应用：
```bash
./gradlew bootRun
```

后端服务将在 http://localhost:8080 启动。

### 前端

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 运行开发服务器：
```bash
npm start
```

前端开发服务器将在 http://localhost:3000 启动。

## 功能特性

### 番茄钟计时器
- 可配置的工作和休息时间
- 声音提醒
- 任务完成统计

## 开发

### 后端开发
- API 文档访问地址：http://localhost:8080/swagger-ui.html
- H2 数据库控制台：http://localhost:8080/h2-console
  - JDBC URL: jdbc:h2:mem:myutilsdb
  - 用户名：sa
  - 密码：（空）

### 前端开发
- 开发服务器支持热重载
- 使用 `npm run build` 构建生产版本

## 部署

### 构建生产版本

1. 构建前端：
```bash
cd frontend && npm run build
```

2. 构建后端：
```bash
cd backend && ./gradlew build
```

生产版本的 JAR 文件将在 `backend/build/libs/` 目录下生成。

### 运行生产版本

```bash
java -jar backend/build/libs/backend-0.0.1-SNAPSHOT.jar
```

应用将在 http://localhost:8080 启动，并提供完整的前后端服务。

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

[MIT License](LICENSE)
