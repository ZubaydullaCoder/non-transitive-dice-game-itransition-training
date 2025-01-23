import { validateDiceInput } from "./diceValidator.js";
import { CryptoHandler } from "./cryptoUtils.js";
import { InputHandler } from "./inputHandler.js";
import { GameLogic } from "./gameLogic.js";
import colors from "colors";

colors.enable();

const args = process.argv.slice(2);

async function startGame(args) {
  try {
    const diceConfigurations = validateDiceInput(args);
    displayWelcomeMessage(diceConfigurations);

    console.log("\n===== PHASE 1: WHO GOES FIRST? =====\n".cyan.bold);
    const firstPlayer = await determineFirstPlayer(diceConfigurations);

    if (firstPlayer === "?") {
      showHelp(diceConfigurations);
      return;
    }

    await playGame(diceConfigurations, firstPlayer);
  } catch (error) {
    console.error("\nOops! Something's not quite right:".red.dim);
    console.error("❌".red.dim, error.message);
    showUsageExample();
    process.exit(1);
  }
}

function displayWelcomeMessage(diceConfigurations) {
  console.log("\n===== NON-TRANSITIVE DICE GAME =====\n".rainbow.bold);
  console.log(
    "Welcome! This is a fair dice game where both player and computer can verify each other's moves."
      .grey
  );
  console.log("\nGame loaded with these dice combinations:".yellow);
  diceConfigurations.forEach((dice, index) => {
    console.log(`${(index + 1 + ":").green} [${dice.join(",")}]`);
  });
}

async function determineFirstPlayer(diceConfigurations) {
  const secretKey = CryptoHandler.generateSecretKey();
  const computerChoice = CryptoHandler.generateSecureRandom(0, 1);
  const hmac = CryptoHandler.calculateHMAC(secretKey, computerChoice);

  while (true) {
    console.log(
      "Let's decide who makes the first move! Computer made its choice and secured it with this verification code:"
        .grey
    );
    console.log(`HMAC: ${hmac}`.yellow);
    console.log("\nTry to guess - heads or tails?".grey);
    console.log("0 = Heads".green);
    console.log("1 = Tails".green);
    console.log("X = Exit game".red);
    console.log("? = Need help?".blue);

    const userGuess = await InputHandler.getUserInput(
      "Your selection for guess".grey,
      [0, 1]
    );

    if (userGuess === "?") {
      showHelp(diceConfigurations);
      continue;
    }

    console.log("\nRevealing the result:".yellow);
    console.log("Computer's choice was:".grey, computerChoice);
    console.log(
      "Verification Key:".grey,
      secretKey.toString("hex").toUpperCase().yellow
    );

    const result = userGuess === computerChoice ? "user" : "computer";
    const winMessage = `\n${
      result === "user" ? "You" : "Computer"
    } won the toss, so ${
      result === "user" ? "You'll go" : "Computer goes"
    } first!`;
    console.log(result === "user" ? winMessage.green : winMessage.red);

    return result;
  }
}

async function playGame(diceConfigurations, firstPlayer) {
  console.log("\n===== PHASE 2: DICE SELECTION =====\n".cyan.bold);
  let computerDice, userDice;

  if (firstPlayer === "computer") {
    console.log("[Computer's Turn]".magenta);
    computerDice = selectComputerDice(diceConfigurations);
    console.log(
      `Computer is choosing its dice: It is [${computerDice.join(",")}] dice.`
        .grey
    );
    console.log(
      "This will be Computer's weapon of choice for this round!\n".yellow
    );

    console.log("[Your Turn]".green);
    userDice = await selectUserDice(diceConfigurations, computerDice);
  } else {
    console.log("[Your Turn]".green);
    userDice = await selectUserDice(diceConfigurations);
    computerDice = selectComputerDice(diceConfigurations, userDice);
    console.log(`\nComputer selected dice: [${computerDice.join(",")}]`.grey);
  }

  console.log(
    `\nYour dice [${userDice.join(
      ","
    )}] vs Computer's dice [${computerDice.join(",")}]`.yellow
  );

  console.log("\n===== PHASE 3: ROLLING THE DICE =====\n".cyan.bold);
  const computerRoll = await GameLogic.performRoll("Computer", computerDice);
  const userRoll = await GameLogic.performRoll("User", userDice);

  console.log("\n===== PHASE 4: ROUND RESULT =====\n".cyan.bold);
  if (userRoll > computerRoll) {
    console.log("🎉 Congratulations! You win! 🎉".green.bold);
    console.log(
      `Your roll of ${userRoll} beats Computer's roll of ${computerRoll}`.green
    );
  } else if (computerRoll > userRoll) {
    console.log("Computer wins!".magenta.bold);
    console.log(
      `Computer's roll of ${computerRoll} beats your ${userRoll}`.magenta
    );
  } else {
    console.log("It's a tie!".yellow.bold, userRoll, "equals", computerRoll);
  }

  await showNextOptions(diceConfigurations);
}

function selectComputerDice(diceConfigurations, excludedDice) {
  const availableDice = diceConfigurations.filter(
    (dice) => !excludedDice || dice.join(",") !== excludedDice.join(",")
  );
  const index = CryptoHandler.generateSecureRandom(0, availableDice.length - 1);
  return availableDice[index];
}

async function selectUserDice(diceConfigurations, excludedDice) {
  console.log("Select your dice:".grey);
  diceConfigurations.forEach((dice, index) => {
    if (!excludedDice || dice.join(",") !== excludedDice.join(",")) {
      console.log(`${(index + 1 + " -").green} [${dice.join(",")}]`);
    }
  });
  console.log("? - View winning chances".blue);

  const validOptions = diceConfigurations
    .map((_, index) => index + 1)
    .filter(
      (i) =>
        !excludedDice ||
        diceConfigurations[i - 1].join(",") !== excludedDice.join(",")
    );

  const selection = await InputHandler.getUserInput(
    "Your choice",
    validOptions
  );

  if (selection === "?") {
    console.log("\n=== WINNING PROBABILITIES ===");
    console.log(GameLogic.calculateWinningProbabilities(diceConfigurations));
    return selectUserDice(diceConfigurations, excludedDice);
  }

  return diceConfigurations[selection - 1];
}

async function showNextOptions(diceConfigurations) {
  console.log("\n=== WHAT'S NEXT ===".cyan.bold);
  console.log("1 - Play another round".green);
  console.log("2 - View winning probabilities".blue);
  console.log("3 - Exit game".yellow);

  const choice = await InputHandler.getUserInput("Your choice", [1, 2, 3]);

  if (choice === 1) {
    await startGame(args);
  } else if (choice === 2) {
    console.log("\n=== WINNING PROBABILITIES ===");
    console.log(GameLogic.calculateWinningProbabilities(diceConfigurations));
    await showNextOptions(diceConfigurations);
  } else {
    process.exit(0);
  }
}

async function showHelp(diceConfigurations) {
  GameLogic.displayHelp(diceConfigurations);
}

function showUsageExample() {
  console.log("\nCorrect usage example:".yellow);
  console.log("node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3\n".green);
}

startGame(args);
