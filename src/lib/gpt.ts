import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
} from "openai";
import { getEnv } from "./utils";

export const fetchFromGPT = async (message: string) => {
  const configuration = new Configuration({
    apiKey: getEnv("OPEN_AI_TOKEN"),
  });
  const openai = new OpenAIApi(configuration);

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: message }],
    functions: [
      {
        name: "createRichText",
        description:
          "Takes an object with a text blocks property which is an array of html text tags and converts it into a single string with rich text formatting.",
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
                    enum: [
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                      "h5",
                      "h6",
                      "p",
                      "blockquote",
                    ],
                  },
                },
              },
            },
          },
          required: ["textBlocks"],
        },
      },
    ],
  });

  return chatCompletion.data.choices[0].message;
};

export const transformGPTResponse = (
  message?: ChatCompletionResponseMessage
) => {
  message!.function_call!.arguments = JSON.parse(
    message!.function_call!.arguments as string
  );
  return message;
};
