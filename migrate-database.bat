@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   数据库一键迁移工具
echo ========================================
echo.

:: 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查 MySQL 是否可用
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未检测到 MySQL 命令行工具
    echo 如果 MySQL 不在 PATH 中，请手动执行 SQL 脚本
    echo.
    set SKIP_SQL=1
) else (
    set SKIP_SQL=0
)

:: 读取环境变量（如果存在 .env.local）
if exist .env.local (
    echo [信息] 检测到 .env.local 文件，正在读取配置...
    for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
        set "key=%%a"
        set "val=%%b"
        if "!key:~0,3!"=="DB_" set "!key!=!val!"
    )
)

:: 设置默认值
if not defined DB_HOST set DB_HOST=localhost
if not defined DB_PORT set DB_PORT=3306
if not defined DB_USER set DB_USER=root
if not defined DB_NAME set DB_NAME=portfolio_db

:: 提示用户输入数据库信息
echo.
echo 数据库配置:
echo   主机: %DB_HOST%
echo   端口: %DB_PORT%
echo   用户: %DB_USER%
echo   数据库: %DB_NAME%
echo.

if not defined DB_PASSWORD (
    set /p DB_PASSWORD="请输入 MySQL 密码: "
    if "!DB_PASSWORD!"=="" (
        echo [错误] 密码不能为空
        pause
        exit /b 1
    )
)

:: 检查数据库是否存在
echo [步骤 1/3] 检查数据库连接...
if %SKIP_SQL%==0 (
    mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p%DB_PASSWORD% -e "SELECT 1;" >nul 2>&1
    if %errorlevel% neq 0 (
        echo [错误] 数据库连接失败，请检查配置
        pause
        exit /b 1
    )
    echo [成功] 数据库连接正常
) else (
    echo [跳过] MySQL 命令行工具不可用，跳过连接检查
)

echo.

:: 步骤 1: 创建数据库和表结构
echo [步骤 2/3] 创建数据库和表结构...
if %SKIP_SQL%==0 (
    if exist "database\migrations\001_initial_schema.sql" (
        echo 正在执行 SQL 脚本...
        mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p%DB_PASSWORD% < "database\migrations\001_initial_schema.sql"
        if %errorlevel% neq 0 (
            echo [错误] SQL 脚本执行失败
            pause
            exit /b 1
        )
        echo [成功] 数据库表结构创建完成
    ) else (
        echo [错误] 找不到 SQL 脚本文件: database\migrations\001_initial_schema.sql
        pause
        exit /b 1
    )
) else (
    echo [跳过] 请手动执行以下命令创建表结构:
    echo    mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p < database\migrations\001_initial_schema.sql
)

echo.

:: 步骤 2: 检查 Node.js 依赖
echo [步骤 3/3] 检查 Node.js 依赖...
set NEEDS_INSTALL=0
if not exist "node_modules\mysql2" set NEEDS_INSTALL=1

if %NEEDS_INSTALL%==1 (
    echo [信息] 缺少必要依赖，正在安装...
    where pnpm >nul 2>nul
    if %errorlevel% equ 0 (
        echo [信息] 检测到 pnpm，正在使用 pnpm 安装...
        call pnpm install
    ) else (
        where npm >nul 2>nul
        if %errorlevel% equ 0 (
            echo [信息] 正在使用 npm 安装...
            call npm install
        ) else (
            echo [错误] 找不到 npm 或 pnpm，无法安装依赖。
            pause
            exit /b 1
        )
    )
) else (
    echo [信息] 依赖已就绪
)

echo.

:: 步骤 3: 运行数据迁移脚本
echo [步骤 3/3] 运行数据迁移脚本...
if exist "database\migrations\002_migrate_projects.js" (
    :: 设置环境变量供 Node.js 脚本使用
    set "DB_HOST=%DB_HOST%"
    set "DB_PORT=%DB_PORT%"
    set "DB_USER=%DB_USER%"
    set "DB_PASSWORD=%DB_PASSWORD%"
    set "DB_NAME=%DB_NAME%"
    
    echo 正在从 JSON 文件迁移数据到数据库...
    node "database\migrations\002_migrate_projects.js"
    if %errorlevel% neq 0 (
        echo [错误] 数据迁移失败
        pause
        exit /b 1
    )
    echo [成功] 数据迁移完成
) else (
    echo [错误] 找不到迁移脚本: database\migrations\002_migrate_projects.js
    pause
    exit /b 1
)

echo.
echo ========================================
echo   迁移完成！
echo ========================================
echo.
echo 数据库信息:
echo   主机: %DB_HOST%
echo   端口: %DB_PORT%
echo   用户: %DB_USER%
echo   数据库: %DB_NAME%
echo.
echo 下一步:
echo   1. 在 .env.local 中配置数据库连接信息
   2. 运行 npm run dev (或 pnpm dev) 启动应用
   3. 访问 http://localhost:3000 查看效果
echo.
pause
