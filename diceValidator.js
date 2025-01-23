export class DiceValidator {
  static REQUIRED_FACES = 6;

  static validateDice(diceStr) {
    // Split the dice string into numbers
    const numbers = diceStr.split(",").map((num) => {
      const parsed = parseInt(num.trim());
      if (isNaN(parsed)) {
        throw new Error("Each dice value must be an integer");
      }
      return parsed;
    });

    // Check number of faces
    if (numbers.length !== this.REQUIRED_FACES) {
      throw new Error(
        `Each dice must have exactly ${this.REQUIRED_FACES} faces`
      );
    }

    return numbers;
  }
}

export function validateDiceInput(args) {
  // Checks if we have at least 3 dice
  if (args.length < 3) {
    throw new Error("At least 3 dice configurations are required");
  }

  // Validates each dice configuration
  const diceConfigurations = args.map((dice) =>
    DiceValidator.validateDice(dice)
  );

  return diceConfigurations;
}
