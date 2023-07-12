export interface IGPTTransformedResponse {
    textBlocks: IGPTTransformedTextBlock[];
    metadata: IGPTTransformedMetadata;
}

export interface IGPTTransformedTextBlock {
    text: string;
    type: string;
    href?: string; 
}

export interface IGPTTransformedMetadata {
    title: string;
    description: string;
    url: string;
    tags: string[];
}