import chalk from "chalk";
import { fetchFromAdana, transformAdanaArticle } from "./adana";
import { fetchFromGPT, transformGPTResponse, gptPromptBuilder } from "./gpt";
import { doSomeWorkButMakeItPretty, writeToFile } from "./utils";

export const transformArticle = async (article: string) => {
  const adanaResponse = await doSomeWorkButMakeItPretty(
    "Adana Fetch",
    async () => {
      const data = await fetchFromAdana(article);
      writeToFile("1-adana.json", data);
      return data;
    }
  );

  const adanaResponseTransformed = await doSomeWorkButMakeItPretty(
    "Transform Data",
    async () => {
      const data = await transformAdanaArticle(adanaResponse);
      writeToFile("2-adana-transformed.json", data);
      return data;
    }
  );

  const gptResponse = await doSomeWorkButMakeItPretty(
    "Crunch numbers with AI",
    async () => {
      const data = await fetchFromGPT(
        gptPromptBuilder(adanaResponseTransformed)
      );
      writeToFile("3-gpt.json", data);
      return data;
    }
  );

  await doSomeWorkButMakeItPretty("Make the AI make sense", async () => {
    const data = transformGPTResponse(gptResponse);
    writeToFile("4-gpt-transformed.json", data);
    return data;
  });

  console.log(chalk.magentaBright("All done and dusted."));
};
