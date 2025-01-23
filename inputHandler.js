import readline from "readline";

export class InputHandler {
  static async getUserInput(prompt, validOptions) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      try {
        const answer = await new Promise((resolve) => {
          rl.question(`${prompt} > `, resolve);
        });

        const selection = answer.trim().toLowerCase();

        if (selection === "x") {
          console.log("Exiting game...");
          process.exit(0);
        }

        if (selection === "?") {
          rl.close();
          return "?";
        }

        const numericSelection = parseInt(selection);

        if (isNaN(numericSelection)) {
          console.log("\nOops! There's a problem:".red.dim);
          console.log("❌".red.dim, "Please enter a valid number");
          console.log("Need help? Type '?' for instructions\n");
          continue;
        }

        if (!validOptions.includes(numericSelection)) {
          console.log("\nHold on a second:".red.dim);
          console.log(
            "❌".red.dim,
            `Please choose from these options: ${validOptions.join(", ")}`
          );
          console.log("Need help? Type '?' for instructions\n");
          continue;
        }

        rl.close();
        return numericSelection;
      } catch (error) {
        console.log("Oops! Something went wrong:".red.dim);
        console.log("❌".red.dim, error.message);
        console.log("Need help? Type '?' for instructions");
        continue;
      }
    }
  }
}
