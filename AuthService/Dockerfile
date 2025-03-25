# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiem TOT proiectul în container
COPY . .

# Restaurăm pachetele și publicăm aplicația
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Etapa de rulare
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "AuthService.dll"]