import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
} from "openai";
import { getEnv } from "./utils/config.util";
import { IGPTTransformedResponse } from "../definitions/IGPT";
import { CONTENTFUL_GPT_BLOCK_MAP } from "../definitions/IContentful";
import { displayInfo } from "./utils/display.util";
import { cursorTo, moveCursor } from "readline";
import chalk from "chalk";

const configuration = new Configuration({
  apiKey: getEnv("OPEN_AI_TOKEN"),
});
const openai = new OpenAIApi(configuration);

export const fetchFromGPT = (message: string) => {
  return new Promise(async (resolve, reject) => {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [{ role: "user", content: message }],
      stream: true,
      functions: [
        {
          name: "createRichText",
          description:
            "Takes an object with a text blocks property which is an array of html text tags and converts it into a single string with rich text formatting",
          parameters: {
            type: "object",
            properties: {
              textBlocks: {
                type: "array",
                description: "An array of text blocks.",
                items: {
                  type: "object",
                  properties: {
                    text: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                      enum: Object.keys(CONTENTFUL_GPT_BLOCK_MAP),
                    },
                    href: {
                      type: "string",
                    },
                  },
                  required: ["text", "type"],
                },
              },
            },
            required: ["textBlocks"],
          },
        },
      ],
    }, { responseType: 'stream' });
    displayInfo('OpenAI is off to work...');

    let totalData = '';
    let blocks = 0;
    let currentLine = '';
    let shouldWriteToConsole = false;
    // http://www.clearscore.com/learn/managing-money/a-guide-to-debt-consolidation-loans

    (chatCompletion.data as any).on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
          const message = line.replace(/^data: /, '');
          try {
              const parsed = JSON.parse(message);
              const delta = parsed.choices[0].delta.function_call.arguments;

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
          } catch(error) {
            resolve(totalData);
          }
        }
    })
  })
};

export const gptSuggestTags = async (message: string) => {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: message }],
    functions: [
      {
        name: "createTags",
        description:
          "Takes an object with a tags property which is an array of strings and converts it into a single string with rich text formatting",
        parameters: {
          type: "object",
          properties: {
            tags: {
              type: "array",
              description: "An array of topics that this content relates to.",
              items: {
                type: "string",
                enum: [
                  "Credit cards",
                  "Balance transfer credit cards",
                  "Rewards credit cards",
                  "Travel credit cards",
                  "0% interest credit cards",
                  "Purchase credit cards",
                  "Credit cards for bad credit",
                  "Credit builder cards",
                  "Money transfer cards",
                  "Credit utilisation",
                  "Credit score",
                  "Credit report",
                  "Improve credit score",
                  "Loans",
                  "Debt consolidation loans",
                  "Loans for bad credit",
                  "Guarantor loans",
                  "Loans for people on benefits",
                  "Low interest loans",
                  "Personal loans",
                  "Secured loans",
                  "Home improvement loans",
                  "Peer to peer lending",
                  "Cost of living",
                  "Car finance",
                  "Persnal contract purchase",
                  "Hire purchase",
                  "Car insurance",
                  "Refinance car",
                  "Protect",
                  "Managing money",
                  "Energy bills",
                  "Mortgages",
                  "Debt",
                  "Lifestyle",
                  "Savings accounts",
                  "Budgeting",
                  "Open banking",
                  "Missed payment",
                ],
              },
            },
          },
          required: ["tags"],
        },
      },
    ],
  });

  return chatCompletion.data.choices[0].message;
};

export const transformGPTResponse = (
  message: string,
  metadata: {
    title: string;
    description: string;
    url: string;
    tags: ChatCompletionResponseMessage;
  }
): IGPTTransformedResponse => {
  const pageData = JSON.parse(message);
  pageData.metadata = {
    title: metadata.title,
    description: metadata.description,
    url: metadata.url,
    tags: JSON.parse(metadata.tags.function_call!.arguments as string).tags,
  };

  return pageData;
};

export const gptPromptBuilder = (content: string) => {
  const initialPrompt = "Create a rich text string from the following content:";

  return `${initialPrompt}
  ${content}`;
};

export const gptTagsPromptBuilder = (content: string) => {
  const initialPrompt =
    "Suggest some tags for the following content in a rich text string:";

  return `${initialPrompt}
  ${content}`;
};
