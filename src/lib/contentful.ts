import contentful from "contentful-management";
import { getEnv } from "./utils/local.util";

import axios from "axios";
import chalk from "chalk";

const client = contentful.createClient({
  accessToken: getEnv("CONTENTFUL_MANAGEMENT_TOKEN"),
});

export const pushToContentful = async (details: {
  title: string;
  description: string;
  url: string;
}) => {
  console.log(chalk.magentaBright("Pushing to Contentful..."));
  const space = await client.getSpace(getEnv("CONTENTFUL_SPACE_ID"));
  const env = await space.getEnvironment("development");
  const url = new URL(details.url);

  console.log(chalk.magentaBright("Create Metadata..."));
  const seoMetadataResponse = await env.createEntry("SeoMetadata", {
    fields: {
      displayName: {
        "en-GB": details.title,
      },
      title: {
        "en-GB": details.title,
      },
      description: {
        "en-GB": details.description,
      },
      noindex: {
        "en-GB": true,
      },
      nofollow: {
        "en-GB": true,
      },
    },
  });

  console.log(chalk.magentaBright("Create Page..."));
  const response = await env.createEntry("Page", {
    fields: {
      displayName: {
        "en-GB": details.title,
      },
      slug: {
        "en-GB": url.pathname,
      },
      seoMetadata: {
        "en-GB": {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: seoMetadataResponse.sys.id,
          },
        },
      },
    },
  });

  console.log(chalk.greenBright("Done"));
};
