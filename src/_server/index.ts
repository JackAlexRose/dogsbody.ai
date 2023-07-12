import chalk from "chalk";
import { fetchLearnArticle, transformAdanaArticle } from "../lib/adana";
import { fetchGptArticleCore, gptPromptBuilder, fetchGptArticleTags, gptTagsPromptBuilder, transformGPTResponse } from "../lib/gpt";
import { writeToFile } from "../lib/utils/files.util";
import { displayInfo, doSomeWorkButMakeItPretty } from "../lib/utils/display.util";
import { pushToContentful } from "../lib/contentful";
import { createInterface } from "readline/promises";
import { cursorTo } from "readline";

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
      let totalData = '';
      let blocks = 0;
      let currentLine = '';
      let shouldWriteToConsole = false;

      const data = await fetchGptArticleCore(
        gptPromptBuilder(adanaResponseTransformed.content),
        (delta) => {
          totalData += delta;
          currentLine += delta;
        
          if (currentLine.includes('"text"')) {
            blocks++;
            currentLine = '';
            shouldWriteToConsole = true;
          };
        
          if (currentLine.includes('",\n') && shouldWriteToConsole) {
            shouldWriteToConsole = false;
            console.log('');
          };
        
          if (shouldWriteToConsole) {
            cursorTo(process.stdout, 0);
            process.stdout.write(chalk.yellowBright(`[BLOCK ${blocks}] ${currentLine.split(' ').length - 1} words`) + chalk.reset(` :: ${currentLine.slice(0, 50).replace(/(?:\r\n|\r|\n)/g, '')}...`))
          };
        }
      );
      writeToFile("3-gpt.json", data);
      return data;
    }
  );

  const gptSuggestedTags = await doSomeWorkButMakeItPretty(
    "Generating tags with AI",
    async () => {
      const data = await fetchGptArticleTags(
        gptTagsPromptBuilder(adanaResponseTransformed.content),
        (_, total) => {
          cursorTo(process.stdout, 0);
          process.stdout.write(chalk.yellowBright(`[TAGS] `) + chalk.reset(total.split(' \"').length))
        }
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
