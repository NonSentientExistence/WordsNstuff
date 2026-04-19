# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig*.json ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# Stage 2: Build the .NET backend and bundle with the frontend output
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src
COPY backend/WordsNstuff/*.csproj ./backend/WordsNstuff/
RUN dotnet restore backend/WordsNstuff/WordsNstuff.csproj
COPY backend/WordsNstuff/ ./backend/WordsNstuff/
# Copy the frontend build output (from stage 1) into wwwroot
COPY --from=frontend-builder /src/dist/ ./backend/WordsNstuff/wwwroot/
RUN dotnet publish backend/WordsNstuff/WordsNstuff.csproj -c Release -o /app/publish --no-restore

# Stage 3: Minimal runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-builder /app/publish .

# Render sets PORT dynamically at runtime; ASPNETCORE_URLS picks it up.
# SQLite DB is ephemeral — it resets on every restart/redeploy (intentional).
CMD ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet WordsNstuff.dll"]
