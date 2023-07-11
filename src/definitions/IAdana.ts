export interface IAdanaResponse {
  data: Data;
  extensions: Extensions;
}

export interface Data {
  getAllLearnArticles: LearnArticle[];
}

export interface LearnArticle {
  id: string;
  locale: string;
  createdOn: any;
  lastSavedOn: any;
  publishedDate: string;
  formattedPublishDate: string;
  slug: string;
  isLegacy: boolean;
  legacySlug: string;
  meta: Meta;
  tags: Tag[];
  language: Language;
  author: Author;
  hero: Hero;
  props: Props;
}

export interface Meta {
  title: string;
  description: string;
  url: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Language {
  title: string;
  heading: string;
  description: string;
  ctaTitle: string;
  ctaBlurb: string;
  ctaButtonCopy: string;
  content: string;
  keyHighlights: string;
  keyHighlightsTitle: string;
}

export interface Author {
  name?: string;
  imageUrl?: string;
  language?: Language2;
}

export interface Language2 {
  title: string;
  bio: string;
}

export interface Hero {
  name?: string;
  imageUrl?: string;
  category?: string;
  language?: Language3;
}

export interface Language3 {
  copyright: string;
  altText: string;
}

export interface Props {
  primaryCategory?: string;
  secondaryCategory: string;
  primaryCategoryUrl: string;
  displayDescription: boolean;
  wordCount?: number;
  displayToc: boolean;
  ctaUrl: string;
}

export interface Extensions {
  runTime: number;
}
