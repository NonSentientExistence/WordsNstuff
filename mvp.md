# MVP Specification: Word Battle Arena

## Product Vision

Word Battle Arena is a turn-based 1v1 word game where vocabulary is your weapon. Both players draw from a shared pool of letters to form words. Each letter carries a specific damage value (e.g., A=1, Z=10). The goal is to calculate the word's total value and deal that amount as damage to the opponent. The last player standing wins.

## Core Gameplay Loop

To prove the core concept of the game, the following flow must be fully functional:

Two players connect to a game session and start with 50 HP each.

A shared, randomized pool of letters is generated.

Player 1 submits a word using letters from the pool.

The system validates that the letters are available and calculates the damage.

The damage is subtracted from Player 2's HP.

The turn passes to Player 2.

The loop repeats until one player's HP reaches 0, triggering a "Game Over / Winner" state.

## Technical Scope (In Scope)

### Frontend (User Interface)

Client Application: A simple, interactive web interface (React) located in src/pages/game.

Player View: Displays the player's own Name and dynamic HP bar.

Opponent View: Displays the opponent's Name and dynamic HP bar.

Game Board: Shows the shared pool of available letters and provides a text input field to submit a word.

State Updates: Instantly updates visual HP and turn indicators based on data received from the backend.

### Backend (API & Game Logic)

Game Engine (C#): Handles the core rules, turn management, and validates if the submitted letters exist in the shared pool.

Damage Calculator: Static calculation based on predefined letter values.

API Endpoints: Receives word submissions from the Frontend and sends back updated game states.

### Database (Data Persistence)

SQLite Database: Stores the persistent state of the game.

Tables: Requires at least a Games table (status, current turn) and a Players table (Player Token, Name, Current HP).

### Infrastructure (CI/CD)

Automated Pipeline: A GitHub Actions YAML workflow that automatically builds the application and runs all tests on every push to the main branch.

## Out of Scope (Deferred for Future Versions)

Dictionary Validation: The system will not check if the word is a real dictionary word, only that the letters exist in the pool.

User Accounts: No login screens or persistent high scores across different sessions.

Animations: No complex visual effects for attacks; instant UI updates only.

## Acceptance Criteria (BDD Scenarios)

To satisfy the TDD and BDD requirements, the system must pass the following automated tests:

### End-to-End / UI Testing (Frontend)

Given an active game session on the client interface
When a player's HP drops to 0 via backend update
Then the Frontend must automatically display a "Game Over" screen.

### Unit Testing (Backend Game Logic)

Given the letter values A=1, B=3, C=3
When a player submits the word "CAB"
Then the logic must calculate and return the damage as exactly 7.

## API / Integration Testing (Backend & Database)

Given the backend service and database are running
When a request is made to initialize a new game
Then the database must successfully save two players, each with exactly 50 HP.
