Sätt upp en postgres server localt, döp den till every_second_letter, om inte ändra path i Server/Properties/launchSettings.json


fyll i appsettings.json med postgres värden man satt upp localt,  Server/appsettings.json

{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=every_second_letter;Username=;Password="
  }
}

FÖR ATT STARTA front och backend i samma terminal npm run dev, för att bara köra frontend npm run start!!!!!!!