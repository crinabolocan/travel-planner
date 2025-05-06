@echo off
echo === [RESET] Removing existing services and routes ===

curl.exe -X DELETE http://localhost:8001/services/authservice
curl.exe -X DELETE http://localhost:8001/services/userdataservice
curl.exe -X DELETE http://localhost:8001/services/tripplannerservice

timeout /t 2 > nul

echo.
echo === [SETUP] Creating services and routes ===

echo [1/6] Creating service: authservice
curl.exe -i -X POST http://localhost:8001/services/ ^
 --data name=authservice ^
 --data url=http://authservice:8080

echo [2/6] Creating route: /auth
curl.exe -i -X POST http://localhost:8001/services/authservice/routes ^
 --data paths[]=/Auth

echo [3/6] Creating service: userdataservice
curl.exe -i -X POST http://localhost:8001/services/ ^
 --data name=userdataservice ^
 --data url=http://userdataservice:8080

echo [4/6] Creating route: /user
curl.exe -i -X POST http://localhost:8001/services/userdataservice/routes ^
 --data paths[]=/user

echo [5/6] Creating service: tripplannerservice
curl.exe -i -X POST http://localhost:8001/services/ ^
 --data name=tripplannerservice ^
 --data url=http://tripplannerservice:8080

echo [6/6] Creating route: /trip
curl.exe -i -X POST http://localhost:8001/services/tripplannerservice/routes ^
 --data paths[]=/trip

echo.
echo === Kong setup complete ===
pause
