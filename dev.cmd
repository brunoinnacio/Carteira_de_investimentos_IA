@echo off
setlocal
set "NODE_DIR=%~dp0..\node-portable\node-v22.22.3-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0"

echo ============================================================
echo  Bolsa Cheia - Servidor de Desenvolvimento Local
echo ============================================================
echo.
echo  Node:  
"%NODE_DIR%\node.exe" --version
echo  npm:   
call "%NODE_DIR%\npm.cmd" --version
echo.
echo  Iniciando o servidor... (aguarde alguns segundos)
echo  Quando aparecer "Ready in...", abra: http://localhost:3000
echo.
echo  Para PARAR o servidor: pressione Ctrl+C nesta janela.
echo ============================================================
echo.

call "%NODE_DIR%\npm.cmd" run dev

echo.
echo ============================================================
echo  Servidor encerrado. Pressione qualquer tecla para fechar.
echo ============================================================
pause >nul
