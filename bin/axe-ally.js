import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({ input, output });
const url = await rl.question("Which URL would you like to scan? ");
rl.close();

console.log(`Scanning: ${url}`);
