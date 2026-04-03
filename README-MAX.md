# Postgres setup

Döp om appSettings-templete.json till appSettings.json

Sätt upp en postgres server localt, döp den till every_second_letter, om inte ändra path i Server/Properties/launchSettings.json

fyll i appsettings.json med postgres värden man satt upp localt,  Server/appsettings.json

{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=every_second_letter;Username=;Password="
  }
}

# Starta projekt
npm run dev kör båda front och backend!!!!


# Test
npm run : 
    "dev": "npm run backend & npm run frontend",
    "start": "npm run dev",
    "backend": "dotnet run --project Server/EverySecondLetter.csproj",
    "frontend": "cd frontend && npm run dev",
    "test": "cd Testing/SystemTests && npm run test",
    "test:api": "cd Testing/SystemTests && npm run test:api"