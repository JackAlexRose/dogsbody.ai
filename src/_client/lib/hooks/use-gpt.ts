import { useState } from "react";
import { fetchGptArticleCore, fetchGptArticleTags, gptPromptBuilder, gptTagsPromptBuilder } from "../../../lib/gpt";
import { fetchLearnArticle, transformAdanaArticle } from "../../../lib/adana";

export const useGPT = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchFromGPT = async (
    message: string,
    callback: (data: string) => void
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    const adanaResponse = await fetchLearnArticle(message);
    const adanaTransformed = await transformAdanaArticle(adanaResponse);

    const data = await fetchGptArticleCore(
      gptPromptBuilder(adanaTransformed.content),
      (_, total) => setCurrentMessage(total)
    );
    setCurrentMessage(data);
    callback(data);
    setIsLoading(false);
    return data;
  };

  return {
    fetchFromGPT,
    isLoading,
    currentMessage,
  };
};

export const useGPTTags = () => {
    const [currentTags, setCurrentTags] = useState("");
    const [isLoadingTags, setIsLoading] = useState(false);

    const fetchTagsFromGPT = async (
        message: string,
        callback: (data: string) => void
    ) => {
        if (isLoadingTags) return;
        setIsLoading(true);
        const adanaResponse = await fetchLearnArticle(message);
        const adanaTransformed = await transformAdanaArticle(adanaResponse);

        const data = await fetchGptArticleTags(
            gptTagsPromptBuilder(adanaTransformed.content),
            (_, total) => setCurrentTags(total)
        );
        setCurrentTags(data);
        callback(data);
        setIsLoading(false);
        return data;
    };

    return {
        fetchTagsFromGPT,
        isLoadingTags,
        currentTags,
    };
};

