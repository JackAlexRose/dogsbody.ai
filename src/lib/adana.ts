import axios from "axios";
import { getEnv } from "./utils/config.util";
import { IAdanaResponse, LearnArticle } from "../definitions/IAdana";

export const fetchLearnArticle = async (articleUrl: string) => {
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
    `${getEnv("ADANA_URL")}/graphql`,
    {
      query,
    },
    { headers: { "content-type": "application/json", "x-api-key": getEnv("ADANA_KEY") } }
  );

  const article = response.data.data.getAllLearnArticles.filter(
    (article) => article.meta.url === articleUrl.replace("https", "http")
  );
  return article[0];
};

export const fetchAllLearnArticles = async () => {
  const query = `query GetAllLearnArticles { getAllLearnArticles {
    meta {
        title
        url
    }
    }}`;

  const response = await axios.post<IAdanaResponse>(
    `${getEnv("ADANA_URL")}/graphql`,
    {
      query,
    },
    { headers: { "content-type": "application/json", "x-api-key": getEnv("ADANA_KEY") } }
  );

  return response.data.data.getAllLearnArticles.map((article) => ({
    title: article.meta.title,
    url: article.meta.url,
  }));
};

export const transformAdanaArticle = (
  article: LearnArticle
): {
  title: string;
  description: string;
  url: string;
  content: string;
} => {
  return {
    title: article.meta.title,
    description: article.meta.description,
    url: article.meta.url,
    content: article.language.content,
  };
};
