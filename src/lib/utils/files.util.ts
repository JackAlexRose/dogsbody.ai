import chalk from "chalk";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { cwd } from "process";

export const writeToFile = (
  name: string,
  message: any,
  isJsonString?: boolean
) => {
  const OUTPUT_DIR = path.join(cwd(), "./out");
  const OUTPUT_FILE = path.join(OUTPUT_DIR, `./${name}`);
  if (existsSync(OUTPUT_FILE)) rmSync(OUTPUT_FILE);
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(isJsonString ? JSON.parse(message) : message, undefined, 2),
    {
      encoding: "utf-8",
    }
  );
};

export const readFile = <T>(name: string, isRawJson?: boolean) => {
  const INPUT_FILE = path.join(cwd(), `./out/${name}`);
  const contents = readFileSync(INPUT_FILE, { encoding: "utf-8" });
  return (isRawJson ? JSON.parse(contents) : contents) as T;
}
