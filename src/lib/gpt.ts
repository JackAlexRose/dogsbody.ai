import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
} from "openai";
import { getEnv } from "./utils/config.util";
import { IGPTTransformedResponse } from "../definitions/IGPT";
import { CONTENTFUL_GPT_BLOCK_MAP } from "../definitions/IContentful";

const configuration = new Configuration({
  apiKey: getEnv("OPEN_AI_TOKEN"),
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);

const streamFromGpt = (message: string, functions: any[], onUpdate?: (delta: string, total: string) => void) => {
  return new Promise<string>(async (resolve) => {
    const isBrowser = (typeof window !== "undefined");

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [{ role: "user", content: message }],
      stream: !isBrowser,
      functions: functions,
    }, { responseType: isBrowser ? 'json' : 'stream' });

    let totalData = '';

    if (isBrowser) {
      const result = chatCompletion.data.choices[0].message?.function_call?.arguments;
      return resolve(result ? result : '{}');
    }

    (chatCompletion.data as any).on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
          const message = line.replace(/^data: /, '');
          try {
              const parsed = JSON.parse(message);
              const delta = parsed.choices[0].delta.function_call.arguments;

              totalData += delta;
              if (onUpdate) onUpdate(delta, totalData);
          } catch(error) {
            resolve(totalData);
          }
        }
    })
  })
}

export const fetchGptArticleCore = (message: string, onUpdate?: (delta: string, total: string) => void) => {
  return streamFromGpt(message, [{
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
  }], onUpdate);
};

export const fetchGptArticleTags = async (message: string, onUpdate?: (delta: string, total: string) => void) => {
  return streamFromGpt(message, [{
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
  }], onUpdate);
};

export const transformGPTResponse = (
  message: string,
  metadata: {
    title: string;
    description: string;
    url: string;
    tags: string;
  }
): IGPTTransformedResponse => {
  const pageData = JSON.parse(message);
  pageData.metadata = {
    title: metadata.title,
    description: metadata.description,
    url: metadata.url,
    tags: JSON.parse(metadata.tags).tags,
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
