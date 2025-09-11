@echo off
setlocal
pushd "%~dp0"

echo === Installing root dependencies ===
call npm install

echo === Installing backend dependencies ===
if exist backend\.env.example if not exist backend\.env (
    copy backend\.env.example backend\.env >nul
    echo Created backend\.env from .env.example
)
pushd backend
call npm install
popd

echo === Installing frontend dependencies ===
pushd frontend
call npm install
popd

echo.
echo Setup complete.
echo To start both servers, run: npm run start:all
pause
