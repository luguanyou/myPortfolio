@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   数据库一键迁移工具（简化版）
echo ========================================
echo.

:: 检查必要文件
if not exist "database\migrations\001_initial_schema.sql" (
    echo [错误] 找不到 SQL 脚本: database\migrations\001_initial_schema.sql
    pause
    exit /b 1
)

if not exist "database\migrations\002_migrate_projects.js" (
    echo [错误] 找不到迁移脚本: database\migrations\002_migrate_projects.js
    pause
    exit /b 1
)

:: 步骤 0: 检查并安装 mysql2 依赖
echo [0/2] 检查必要依赖...
if not exist "node_modules\mysql2" (
    echo [信息] 找不到 mysql2，正在尝试安装...
    where pnpm >nul 2>nul
    if %errorlevel% equ 0 (
        echo [信息] 检测到 pnpm，正在使用 pnpm 安装...
        call pnpm install mysql2
    ) else (
        where npm >nul 2>nul
        if %errorlevel% equ 0 (
            echo [信息] 正在使用 npm 安装...
            call npm install mysql2
        ) else (
            echo [错误] 找不到 npm 或 pnpm，无法安装依赖。请手动安装 mysql2。
            pause
            exit /b 1
        )
    )
) else (
    echo [成功] 依赖已就绪
)

:: 读取 .env.local 中的数据库配置
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=root
set DB_NAME=portfolio_db
set DB_PASSWORD=

if exist .env.local (
    echo [信息] 正在从 .env.local 读取配置...
    for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
        if "%%a"=="DB_HOST" set DB_HOST=%%b
        if "%%a"=="DB_PORT" set DB_PORT=%%b
        if "%%a"=="DB_USER" set DB_USER=%%b
        if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
        if "%%a"=="DB_NAME" set DB_NAME=%%b
    )
)

:: 如果密码为空，提示输入
if "!DB_PASSWORD!"=="" (
    set /p DB_PASSWORD="请输入 MySQL root 密码: "
)

:: 步骤 1: 创建数据库和表结构
echo.
echo [1/2] 创建数据库和表结构...
mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p%DB_PASSWORD% < "database\migrations\001_initial_schema.sql"
if %errorlevel% neq 0 (
    echo [错误] SQL 脚本执行失败，请检查数据库配置
    pause
    exit /b 1
)
echo [成功] 数据库表结构已创建

:: 步骤 2: 运行数据迁移
echo.
echo [2/2] 迁移项目数据...
set "DB_HOST=%DB_HOST%"
set "DB_PORT=%DB_PORT%"
set "DB_USER=%DB_USER%"
set "DB_PASSWORD=%DB_PASSWORD%"
set "DB_NAME=%DB_NAME%"

node "database\migrations\002_migrate_projects.js"
if %errorlevel% neq 0 (
    echo [错误] 数据迁移失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   迁移完成！
echo ========================================
echo.
pause
