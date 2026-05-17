#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import { execSync } from "child_process";
import generateCommand from "../service/ollama.js";

const program = new Command();

program
  .name("agcp")
  .description("AI CLI that generates and runs shell commands")
  .version("1.0.0")
  .argument("<prompt>", "Describe what you want to do")
  .action(async (prompt) => {
    try {
      console.log(chalk.yellow("\n⏳ Generating command..."));

      const command = await generateCommand(prompt);

      console.log(chalk.cyan(`\n💡 Suggested command:\n  ${chalk.bold(command)}\n`));

      const shouldRun = await confirm({
        message: "Execute this command?",
        default: false,
      });

      if (shouldRun) {
        console.log(chalk.green("\n▶ Running...\n"));
        execSync(command, { stdio: "inherit" });
      } else {
        console.log(chalk.gray("\nAborted."));
      }
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        console.error(chalk.red("\n✖ Could not connect to Ollama. Make sure it is running on http://localhost:11434"));
      } else {
        console.error(chalk.red(`\n✖ Error: ${err.message}`));
      }
      process.exit(1);
    }
  });

program.parse();
