@echo off
setlocal

echo ============================================
echo 📊 Independent Graphify Setup & Optimizer
echo ============================================

:: 1. Environment Check
echo 🔍 Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH. Please install Python.
    exit /b 1
)

:: 2. Install/Update graphifyy
echo 🐍 Installing/Updating graphifyy package...
pip install graphifyy --upgrade

:: 3. Setup Project Structure
if not exist "tools" mkdir tools
if not exist "graphify-out" mkdir "graphify-out"

:: 4. Clone Source (Optional but recommended for skills)
if not exist "tools\graphify" (
    echo 📥 Cloning Graphify source...
    git clone https://github.com/safishamsi/graphify tools\graphify
)

:: 5. Initialize .graphifyignore
if not exist ".graphifyignore" (
    echo 📝 Creating default .graphifyignore...
    (
        echo # Ignore build and dependency folders
        echo node_modules/
        echo dist/
        echo build/
        echo .next/
        echo .cache/
        echo.
        echo # Ignore system/IDE files
        echo .git/
        echo .vscode/
        echo .idea/
        echo.
        echo # Ignore media and logs
        echo *.log
        echo *.png
        echo *.jpg
        echo *.jpeg
        echo *.gif
        echo *.svg
        echo *.mp4
        echo.
        echo # Ignore graphify output itself
        echo graphify-out/
    ) > .graphifyignore
)

:: 6. Apply Windows Multiprocessing Safeguard
:: This creates a small wrapper to prevent recursive process spawning on Windows
echo 🛡️  Applying Windows stability patch...
(
    echo import sys, os
    echo from graphify.__main__ import main
    echo if __name__ == '__main__':
    echo     # Ensure UTF-8 for Windows console
    echo     os.environ['PYTHONIOENCODING'] = 'utf-8'
    echo     main^(^)
) > "graphify_win.py"

:: 7. Register with Antigravity
echo 🤖 Registering with Antigravity...
python graphify_win.py install --platform gemini

:: 8. Build Knowledge Graph (AST Pass)
echo 🏗️  Building Knowledge Graph (Structure Only)...
echo (This avoids high API costs by scanning locally first)
python graphify_win.py . --no-semantic

:: 9. Generate Insights & Benchmarks
echo 📊 Running optimization benchmark...
python graphify_win.py benchmark

echo 🎨 Generating interactive HTML graph...
python graphify_win.py export html

echo ============================================
echo ✅ Independent Graphify Setup Complete!
echo ============================================
echo 💡 INSTRUCTIONS:
echo 1. You can now use '/graphify query "your question"' in the AI chat.
echo 2. Run this script again any time to update your codebase graph.
echo 3. The interactive map is at: graphify-out/graph.html
echo ============================================
pause
