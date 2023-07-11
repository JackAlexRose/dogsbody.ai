import axios from "axios";
import { getEnv, writeToFile } from "./utils";
import { IAdanaResponse, LearnArticle } from "../definitions/IAdana";
import { gptPromptBuilder } from "./gpt";

const fetchLearnArticle = async (
  api: string,
  apiKey: string,
  articleUrl: string
) => {
  const query = `query GetAllLearnArticles { getAllLearnArticles {
    id
    locale
    createdOn
    lastSavedOn
    publishedDate
    formattedPublishDate
    slug
    isLegacy
    legacySlug
    meta {
        title
        description
        url
    }
    tags {
        name
        slug
    }
    language {
        title
        heading
        description
        ctaTitle
        ctaBlurb
        ctaButtonCopy
        content
        keyHighlights
        keyHighlightsTitle
    }
    author {
        name
        imageUrl
        language {
            title
            bio
        }
    }
    hero {
        name
        imageUrl
        category
        language {
            copyright
            altText
        }
    }
    props {
        primaryCategory
        secondaryCategory
        primaryCategoryUrl
        displayDescription
        wordCount
        displayToc
        ctaUrl
    }
    }}`;

  const response = await axios.post<IAdanaResponse>(
    `${api}/graphql`,
    {
      query,
    },
    { headers: { "content-type": "application/json", "x-api-key": apiKey } }
  );

  const article = response.data.data.getAllLearnArticles.filter(
    (article) => article.meta.url === articleUrl.replace("https", "http")
  );
  return article[0];
};

export const fetchFromAdana = async (articleUrl: string) => {
  return await fetchLearnArticle(
    getEnv("ADANA_URL"),
    getEnv("ADANA_KEY"),
    articleUrl
  );
};

export const transformAdanaArticle = (
  article: LearnArticle
): Parameters<typeof gptPromptBuilder>[0] => {
  return {
    title: article.meta.title,
    description: article.meta.description,
    url: article.meta.url,
    content: article.language.content,
  };
};