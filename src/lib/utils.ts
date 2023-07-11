import * as dotenv from "dotenv";
import chalk from "chalk";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { cwd } from "process";
dotenv.config();

export const getEnv = (
  key: string,
  type?: StringConstructor | NumberConstructor | BooleanConstructor
) => {
  return (type ?? (String as any))(process.env[key]);
};

export const writeToFile = (
  name: string,
  message: any,
  isRawJson?: boolean
) => {
  const OUTPUT_DIR = path.join(cwd(), "./out");
  const OUTPUT_FILE = path.join(OUTPUT_DIR, `./${name}`);
  if (existsSync(OUTPUT_FILE)) rmSync(OUTPUT_FILE);
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(isRawJson ? JSON.parse(message) : message, undefined, 2),
    {
      encoding: "utf-8",
    }
  );
};

export const doSomeWorkButMakeItPretty = async (
  name: string,
  callback: () => Promise<any>
) => {
  try {
    console.log(chalk.cyan(`[Working] ${name}...`));
    const data = await callback();
    console.log(chalk.greenBright(`[Done] ${name}.`));
    return data;
  } catch (e) {
    console.log(chalk.red(`[Error] ${name}.`));
    console.error(e);
    process.exit(1);
  }
};
