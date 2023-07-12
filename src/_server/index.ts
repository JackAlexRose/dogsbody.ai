import chalk from "chalk";
import { fetchLearnArticle, transformAdanaArticle } from "../lib/adana";
import { fetchFromGPT, gptPromptBuilder, gptSuggestTags, gptTagsPromptBuilder, transformGPTResponse } from "../lib/gpt";
import { writeToFile } from "../lib/utils/files.util";
import { displayInfo, doSomeWorkButMakeItPretty } from "../lib/utils/display.util";
import { pushToContentful } from "../lib/contentful";
import { createInterface } from "readline/promises";

const run = async () => {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const articleLink = await readline.question(`${chalk.magentaBright('Enter Article link: ')}`);
  readline.close();

  const adanaResponse = await doSomeWorkButMakeItPretty(
    "Adana Fetch",
    async () => {
      const data = await fetchLearnArticle(articleLink);
      displayInfo(`Found: ${data.meta.title}`);
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
    "OpenAI Bleep Bloop",
    async () => {
      const data = await fetchFromGPT(
        gptPromptBuilder(adanaResponseTransformed.content)
      );
      writeToFile("3-gpt.json", data);
      return data;
    }
  );

  const gptSuggestedTags = await doSomeWorkButMakeItPretty(
    "Generating tags with AI",
    async () => {
      const data = await gptSuggestTags(
        gptTagsPromptBuilder(adanaResponseTransformed.content)
      );
      writeToFile("4-gpt-tags.json", data);
      return data;
    }
  );

  const transformedGptResponse = await doSomeWorkButMakeItPretty("Make the AI make sense", async () => {
    const data = transformGPTResponse(gptResponse, {
      title: adanaResponseTransformed.title,
      description: adanaResponseTransformed.description,
      url: adanaResponseTransformed.url,
      tags: gptSuggestedTags,
    });
    writeToFile("5-gpt-transformed.json", data);
    return data;
  });

  await doSomeWorkButMakeItPretty("Transform GPT to Contentful", async () => {
    const pageUrl = await pushToContentful(transformedGptResponse);
    displayInfo(`Contentful Link: ${pageUrl}`);
  });

  console.log(chalk.magentaBright("All done and dusted."));
};

run();
