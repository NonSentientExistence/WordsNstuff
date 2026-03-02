# EverySecondLetter (Clean + Minimal API + SQL)

## Requirements
- .NET 8 SDK
- Postgres
- psql (optional)

## Setup DB
1) Create a database (example: everysecondletter)
2) Run:
   psql "<YOUR CONNECTION STRING>" -f sql/001_init.sql

## Configure connection string

_Right now the connection string is defaulted in Properties/launchSettings.json but if you want to handle it properly:_ 

Either:
- set environment variable DATABASE_URL (postgres://user:pass@host:5432/dbname)
or
- set ConnectionStrings__Default

### Examples:

Mac/Linux (for a session, read documentation below for guide):
`export DATABASE_URL=postgres://postgres:postgres@localhost:5432/every_second_letter`

Windows (for a session):
`set DATABASE_URL=postgres://postgres:postgres@localhost:5432/every_second_letter`

or permanently,
`setx DATABASE_URL "postgres://postgres:postgres@localhost:5432/every_second_letter"`

Documentation: https://configu.com/blog/setting-env-variables-in-windows-linux-macos-beginners-guide/


## Run
dotnet run

Then open:
http://localhost:5000 (or the URL shown by dotnet)

## Notes
- Dictionary is tiny and in-memory (WordsService). Dispute uses it.
- No EF, no repositories; SQL lives in GamesService.
- Minimal API routes are defined in Program.cs (top-level statements).


Absolutely — here is a clean, copy-paste-ready section for your `README.md`.

It explains gameplay clearly without exposing internal implementation details, and it matches your current mechanics exactly.

---

# Gameplay & Rules

## Overview

EverySecondLetter is a two-player, turn-based word game.

Players collaboratively build a word by placing one letter at a time.
At any point (after placing a letter), a player may **claim** the current word to score points — but the opponent may **dispute** the claim.

The game introduces a risk-reward mechanic through the Claim / Dispute system.



## Game Flow

### Create / Join

* Player 1 creates a game.
* Player 2 joins using the Game ID.
* The game starts automatically when two players are present.



### Playing Letters

* Players take turns.
* On your turn, you may:

   * Place **exactly one letter (A–Z)**.
* The letter is appended to the current word.
* The turn then passes to the other player.

Example:

| Turn | Player | Word |
| ---- | ------ | ---- |
| 1    | A      | H    |
| 2    | B      | HE   |
| 3    | A      | HEL  |
| 4    | B      | HELL |



### Claiming a Word

A player may click **Claim Word**:

* On their turn
  **or**
* Immediately after placing their most recent letter

Minimum word length: **3 letters**

When a word is claimed:

* The game enters `PendingDispute` state
* No further letters can be placed
* The opponent must choose to:

   * **Accept**
   * **Dispute**



## Claim / Dispute Rules

### If the opponent Accepts

The claimer receives:

```
baseScore = (number of letters the claimer placed in this word)²
```

Example:

* Word = HELLO
* Player A placed H, L, O → 3 letters
* Score = 3² = 9 points



### If the opponent Disputes

The word is validated against the dictionary.

#### Case 1 — Word is valid

* Claimer receives **150%** of base score
* Opponent receives 0

```
finalScore = floor(baseScore × 1.5)
```

This rewards confident claims.



#### Case 2 — Word is invalid

* Claimer receives 0
* Opponent receives **50%** of base score

```
opponentScore = floor(baseScore × 0.5)
```

This punishes risky or fake claims.



## After Resolution

After Accept or Dispute:

* The current word resets to empty
* Letter contributions reset
* The turn goes to the opponent of the claimer
* The game continues



## Dictionary

* Words are validated using the ENABLE word list
* Word validation is case-insensitive
* Only words with **3 or more letters** are allowed



## Strategy

The game balances cooperation and competition:

* Build a strong word together…
* Or sabotage subtly.
* Claim early for safety…
* Or risk a dispute for bonus points.

