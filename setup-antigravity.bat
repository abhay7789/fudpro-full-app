@echo off
echo ============================================
echo 🚀 Starting Antigravity Full Setup...
echo ============================================

:: Stop on error
setlocal enabledelayedexpansion

:: Step 1: Check Node
echo 🔍 Checking Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b
)

:: Step 2: Initialize Antigravity
IF NOT EXIST ".agent" (
    echo 📦 Initializing Antigravity Kit...
    call npx @vudovn/ag-kit init
) ELSE (
    echo ✅ .agent already exists, skipping init...
)

:: Step 3: Check skillfish
echo 🔧 Checking skillfish...
where skillfish >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing skillfish...
    npm install -g skillfish
) ELSE (
    echo ✅ skillfish already installed
)

echo ============================================
echo ⚡ Installing Skills...
echo ============================================

:: Backend & Core
call npx skillfish add affaan-m/everything-claude-code coding-standards
call npx skillfish add affaan-m/everything-claude-code backend-patterns
call npx skillfish add affaan-m/everything-claude-code api-design
call npx skillfish add affaan-m/everything-claude-code tdd-workflow
call npx skillfish add affaan-m/everything-claude-code security-review

:: Frontend & QA
call npx skillfish add affaan-m/everything-claude-code frontend-patterns
call npx skillfish add affaan-m/everything-claude-code browser-qa
call npx skillfish add affaan-m/everything-claude-code click-path-audit

:: OpenClaw Agents
call npx skillfish add openclaw/openclaw coding-agent
call npx skillfish add openclaw/openclaw github

:: Create directories
IF NOT EXIST ".agent\skills" mkdir ".agent\skills"
IF NOT EXIST ".agent\workflows" mkdir ".agent\workflows"
IF NOT EXIST "tools" mkdir "tools"

echo ============================================
echo 📦 Cloning Additional Repositories...
echo ============================================

:: UI/UX Skill
IF NOT EXIST ".agent\skills\ui-ux-pro-max" (
    echo 🎨 Installing UI/UX Pro Max Skill...
    git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill .agent\skills\ui-ux-pro-max
) ELSE (
    echo ⚠️ UI/UX Skill already exists
)

:: Awesome Skills
IF NOT EXIST ".agent\skills\awesome-skills" (
    echo 🧠 Installing Awesome Skills...
    git clone https://github.com/sickn33/antigravity-awesome-skills .agent\skills\awesome-skills
) ELSE (
    echo ⚠️ Awesome Skills already exist
)

:: Graphify
IF NOT EXIST "tools\graphify" (
    echo 📊 Installing Graphify...
    git clone https://github.com/safishamsi/graphify tools\graphify
) ELSE (
    echo ⚠️ Graphify already exists
)

:: Workflow Pack
IF NOT EXIST ".agent\workflows\get-shit-done" (
    echo ⚡ Installing Workflow Pack...
    git clone https://github.com/toonight/get-shit-done-for-antigravity .agent\workflows\get-shit-done
) ELSE (
    echo ⚠️ Workflow pack already exists
)

echo ============================================
echo 🎉 Antigravity Setup Complete!
echo ============================================
echo 🔥 Your AI system is fully ready!
echo.

pause