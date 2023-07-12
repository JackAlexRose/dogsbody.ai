export const CONTENTFUL_GPT_BLOCK_MAP = {
    'h1': 'heading-1',
    'h2': 'heading-2',
    'h3': 'heading-3',
    'h4': 'heading-4',
    'h5': 'heading-5',
    'h6': 'heading-6',
    'p': 'paragraph',
    'a': 'hyperlink',
    'blockquote': 'blockquote',
} as const;

export interface IContentfulGenerator {
    id: string;
    data: {
        nodeType?: string;
        data?: unknown;
        content?: IContentfulRichTextBlock[];
        fields?: {
            [key: string]: {
                'en-GB': any;
            }
        };
    };
}

export interface IContentfulEntryLink {
    type: string;
    linkType: string;
    id: string;
}

export interface IContentfulRichTextBlock {
    nodeType: string;
    data: unknown;
    content?: IContentfulRichTextBlock[];
    marks?: string[]
    value?: string;
}