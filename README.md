# Non-Transitive Dice Game

A cryptographically secure command-line implementation of a non-transitive dice game where both player and computer can verify each other's moves.

---

## Features

- **🎲 Support for 3 or more dice configurations**
- **🔐 Cryptographically secure random number generation**
- **✨ Fair play verification using HMAC-SHA3**
- **📊 Probability analysis for dice combinations**
- **🎮 Interactive command-line interface**
- **🎯 User-friendly error handling**

---

## Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/non-transitive-dice-game.git
   cd non-transitive-dice-game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage

Run the game with dice configurations as command-line arguments:

### Game Rules

- Each die must have exactly **6 faces**.
- At least **3 dice configurations** are required.
- Players take turns selecting and rolling dice.
- The highest roll wins the round.
- All moves are cryptographically verified for fairness.

### Valid Input Examples

#### Three Dice Example

```bash
node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
```

#### Four Dice Example

```bash
node game.js 1,2,3,4,5,6 2,3,4,5,6,1 3,4,5,6,1,2 4,5,6,1,2,3
```

### Game Commands

- **0-5** - Select numbers during rolls
- **?** - View help and probabilities
- **X** - Exit game

---

## Project Structure

- **game.js** - Main game logic and flow control
- **cryptoUtils.js** - Cryptographic operations
- **diceValidator.js** - Input validation
- **gameLogic.js** - Core game mechanics
- **inputHandler.js** - User input processing

---

## Technical Implementation

### Security Features

- Uses **Node.js crypto module** for secure random generation.
- Implements **HMAC-SHA3** for move verification.
- Ensures uniform distribution in random number generation.

### Dependencies

- **cli-table3** - For formatted table output.
- **colors** - For colorized console output.

---

## Error Handling

The game provides user-friendly error messages for:

- Invalid dice configurations.
- Incorrect number of dice.
- Non-integer values.
- Invalid user input.

---

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the **ISC License** - see the `package.json` file for details.

---

## Acknowledgments

- Task requirements from **Itransition**.
- **Node.js crypto module** documentation.
- **CLI-Table3** documentation.
