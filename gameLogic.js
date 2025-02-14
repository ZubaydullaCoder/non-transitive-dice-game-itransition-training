import { CryptoHandler } from "./cryptoUtils.js";
import { InputHandler } from "./inputHandler.js";
import Table from "cli-table3";
import colors from "colors";

colors.enable();

export class GameLogic {
  static async performRoll(playerType, diceValues) {
    while (true) {
      const secretKey = CryptoHandler.generateSecretKey();
      const computerNumber = CryptoHandler.generateSecureRandom(0, 5);
      const hmac = CryptoHandler.calculateHMAC(secretKey, computerNumber);
      console.log(`[${playerType}'s roll]`);
      console.log(
        "To ensure fair play, we'll both contribute to the final roll.".grey
      );
      console.log(`Computer has secured its number with this code:`.grey);
      console.log(`HMAC: ${hmac}`.yellow);

      const userNumber = await InputHandler.getUserInput(
        `Please add your number (0-5) for ${playerType}`,
        [0, 1, 2, 3, 4, 5]
      );

      if (userNumber === "?") {
        console.log("\n===== ROLL HELP START =====\n".cyan.bold);
        console.log("How the roll works:".underline);
        console.log("1. Computer generates a secure random number (0-5)");
        console.log("2. You provide your number (0-5)");
        console.log(
          "3. Numbers are added and divided by 6 to get final position"
        );
        console.log(
          "4. The dice face at that position becomes the roll result"
        );
        console.log("\nAvailable numbers: 0, 1, 2, 3, 4, 5");
        console.log("Type 'X' to exit or select a number to continue");
        console.log("\n===== ROLL HELP END =====\n".cyan.bold);
        continue;
      }

      console.log("\nLet's verify:".grey);
      console.log(`Computer's number was: ${computerNumber}`.grey);
      console.log(
        "Verification Key:".grey,
        secretKey.toString("hex").toUpperCase().yellow
      );

      const finalNumber = (computerNumber + userNumber) % 6;
      const rollResult = diceValues[finalNumber];

      console.log("\nCalculating final roll:".grey);
      console.log(`(${computerNumber} + ${userNumber}) % 6 = ${finalNumber}`);
      console.log(
        `Using dice face at position ${finalNumber}: ${playerType}'s dice shows ${
          rollResult.toString().magenta
        }\n`
      );

      return rollResult;
    }
  }

  static calculateWinningProbabilities(diceConfigurations) {
    // Pre-calculate probabilities matrix
    const probMatrix = diceConfigurations.map((dice1) => 
        diceConfigurations.map((dice2) => {
            if (dice1 === dice2) return null;
            
            // Calculate wins using reduce for better readability
            const wins = dice1.reduce((total, val1) => 
                total + dice2.reduce((wins, val2) => 
                    wins + (val1 > val2 ? 1 : 0), 0
                ), 0);
            
            return ((wins / 36) * 100).toFixed(1) + "%";
        })
    );

    // Create table header
    const tableHeader = ["Dice vs".green];
    tableHeader.push(...diceConfigurations.map(dice => 
        `[${dice.join(",")}]`.green
    ));

    // Initialize table with styling
    const table = new Table({
        head: tableHeader,
        style: { head: [], border: [] },
        chars: {
            top: "─", "top-mid": "┬", "top-left": "┌", "top-right": "┐",
            bottom: "─", "bottom-mid": "┴", "bottom-left": "└", "bottom-right": "┘",
            left: "│", "left-mid": "├", mid: "─", "mid-mid": "┼",
            right: "│", "right-mid": "┤", middle: "│"
        }
    });

    // Build table rows from pre-calculated matrix
    diceConfigurations.forEach((dice, i) => {
        table.push({
            [`[${dice.join(",")}]`.green]: probMatrix[i].map(prob => 
                prob === null ? "-" : prob
            )
        });
    });

    return [
        "\nWinning Probabilities Table:".bold,
        "• Each row shows how likely that dice is to win against others",
        "• Higher percentage means better winning chance",
        "• '-' means same dice can't play against itself",
        "• Probabilities are calculated based on all possible combinations\n",
        table.toString()
    ].join("\n");
  }

  static displayHelp(diceConfigurations) {
    console.log("\n===== GAME HELP START =====\n".cyan.bold);

    console.log("Game Rules:".underline);
    console.log("1. First, we determine who goes first through a coin flip");
    console.log("2. Players take turns selecting and rolling dice");
    console.log("3. Highest roll wins the round");
    console.log("4. All moves are cryptographically verified for fairness\n");

    console.log("Current Dice Configurations:".underline);
    diceConfigurations.forEach((dice, index) => {
      console.log(`Dice ${index + 1}: [${dice.join(", ")}]`);
    });

    console.log("\n===== PROBABILITIES =====".yellow);
    console.log(this.calculateWinningProbabilities(diceConfigurations));

    console.log("===== GAME HELP END =====\n".cyan.bold);
  }
}
