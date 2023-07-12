// import contentful from "contentful-management";
import { getEnv } from "./utils/config.util";
import { IGPTTransformedResponse, IGPTTransformedTextBlock } from "../definitions/IGPT";
import { CONTENTFUL_GPT_BLOCK_MAP, IContentfulEntryLink, IContentfulGenerator, IContentfulRichTextBlock } from "../definitions/IContentful";
import { displayInfo } from "./utils/display.util";
import axios from "axios";

const makeContentfulRequest = async (id: string, data: any) => {
  const response = await axios.post(`https://api.contentful.com/spaces/${getEnv("CONTENTFUL_SPACE_ID")}/environments/${getEnv('CONTENTFUL_ENVIRONMENT')}/entries`, data, {
    headers: {
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Content-Type': id,
      'Authorization': `Bearer ${getEnv("CONTENTFUL_MANAGEMENT_TOKEN")}`
    }
  });
  return response.data;
}

export const pushToContentful = async (data: IGPTTransformedResponse, update?: (message: string) => void) => {
  // const space = await client.getSpace(getEnv("CONTENTFUL_SPACE_ID"));
  // const env = await space.getEnvironment(getEnv('CONTENTFUL_ENVIRONMENT'));
  const url = new URL(data.metadata.url);
  
  const seoMetadata = generateSeoMetadata(data);
  displayInfo(`Creating ${seoMetadata.id}...`);
  if (update) update(`Creating ${seoMetadata.id}...`)
  const seoMetadataResponse = await makeContentfulRequest(seoMetadata.id, seoMetadata.data as any);
  // const seoMetadataResponse = await env.createEntry(seoMetadata.id, seoMetadata.data as any);
  
  const richText = generateRichText(data.textBlocks);
  displayInfo(`Creating ${richText.id}...`);
  if (update) update(`Creating ${richText.id}...`)
  const richTextResponse = await makeContentfulRequest(richText.id, richText.data as any);
  // const richTextResponse = await env.createEntry(richText.id, richText.data as any);

  // displayInfo(`Checking Tags...`);
  // if (update) update(`Checking Tags...`)
  // const tags = (await env.getTags({
  //   limit: 1000,
  // })).items;

  // for (let i = 0; i < data.metadata.tags.length; i++) {
  //   const tag = data.metadata.tags[i];
  //   if (!tags.find((x) => x.name === tag)) {
  //     let camelCaseId = tag.toLowerCase().split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('');
  //     camelCaseId = `${camelCaseId.charAt(0).toLowerCase()}${camelCaseId.slice(1)}`;
      
  //     displayInfo(`Creating Tag: ${camelCaseId}...`);
  //     if (update) update(`Creating Tag: ${camelCaseId}...`)
  //     const tagResponse = await env.createTag(camelCaseId, tag);
  //     tags.push({
  //       name: tag,
  //       sys: tagResponse.sys
  //     } as any);
  //   }
  // }

  // const tagsUsed = tags.filter((x) => data.metadata.tags.includes(x.name));
  // displayInfo(`Total Page Tags ${tagsUsed.length}`);

  displayInfo(`Creating Page...`);
  if (update) update(`Creating Page...`)
  const pageResponse = await makeContentfulRequest("Page", {
    fields: {
      displayName: generateLocalisedData(data.metadata.title),
      slug: generateLocalisedData(url.pathname),
      seoMetadata: generateLocalisedData({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: seoMetadataResponse.sys.id,
        }
      }),
      content: generateLocalisedData([
        {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: richTextResponse.sys.id,
          }
        }
      ]),
    },
    // metadata: {
    //   tags: tagsUsed.map((x) => ({
    //     sys: {
    //       type: "Link",
    //       id: x.sys.id,
    //       linkType: 'Tag'
    //     }
    //   }))
    // }
  });
  // const pageResponse = await env.createEntry("Page", {
  //   fields: {
  //     displayName: generateLocalisedData(data.metadata.title),
  //     slug: generateLocalisedData(url.pathname),
  //     seoMetadata: generateLocalisedData({
  //       sys: {
  //         type: "Link",
  //         linkType: "Entry",
  //         id: seoMetadataResponse.sys.id,
  //       }
  //     }),
  //     content: generateLocalisedData([
  //       {
  //         sys: {
  //           type: "Link",
  //           linkType: "Entry",
  //           id: richTextResponse.sys.id,
  //         }
  //       }
  //     ]),
  //   },
  //   metadata: {
  //     tags: tagsUsed.map((x) => ({
  //       sys: {
  //         type: "Link",
  //         id: x.sys.id,
  //         linkType: 'Tag'
  //       }
  //     }))
  //   }
  // });

  if (update) update(`Contentful Upload Done!`)
  return `https://app.contentful.com/spaces/${getEnv('CONTENTFUL_SPACE_ID')}/environments/${getEnv('CONTENTFUL_ENVIRONMENT')}/entries/${pageResponse.sys.id}`
};

const generateLocalisedData = (data: any) => {
  return {
    "en-GB": data
  }
}

const generateSeoMetadata = (data: IGPTTransformedResponse): IContentfulGenerator => {
  return {
    id: "SeoMetadata",
    data: {
      fields: {
        displayName: generateLocalisedData(data.metadata.title),
        title: generateLocalisedData(data.metadata.title),
        description: generateLocalisedData(data.metadata.description),
        noindex: generateLocalisedData(true),
        nofollow: generateLocalisedData(true),
      }
    }
  }
}

const generateRichTextBlock = (block: IGPTTransformedTextBlock): IContentfulRichTextBlock => {  
  return {
    // @ts-ignore
    nodeType: CONTENTFUL_GPT_BLOCK_MAP[block.type],
    data: {},
    content: [
      {
        nodeType: "text",
        value: block.text,
        marks: [],
        data: {},
      }
    ],
  }
}

const generateRichText = (blocks: IGPTTransformedTextBlock[]): IContentfulGenerator => {
  return {
    id: "RichText",
    data: {
      fields: {
        displayName: generateLocalisedData(blocks[0].text.slice(0, 25)),
        section: generateLocalisedData({
          sys: {
            type: "Link",
            linkType: "Entry",
            id: "59YeYkDpqHAte1VQLc4Nms"
          }
        }),
        text: generateLocalisedData({
          data: {},
          content: blocks.map(block => generateRichTextBlock(block)).filter((x) => x.nodeType !== undefined),
          nodeType: 'document',
        }),
      }
    } as any
  }
}

const generatePage = (data: IGPTTransformedResponse, metaDataSys: IContentfulEntryLink): IContentfulGenerator => {
  return {
    id: "Page",
    data: {
      fields: {
        displayName: generateLocalisedData(data.metadata.title),
        slug: generateLocalisedData(data.metadata.url),
        seoMetadata: generateLocalisedData({
          sys: metaDataSys,
        })
      },
    }
  }
}

export const transformForContentful = async (data: IGPTTransformedResponse) => {
  const seoMetadata = generateSeoMetadata(data);
  const page = generatePage(data, undefined as any);
  const richText = generateRichText(data.textBlocks);

  return {
    seoMetadata: seoMetadata,
    page: page,
    richText: richText
  }
};