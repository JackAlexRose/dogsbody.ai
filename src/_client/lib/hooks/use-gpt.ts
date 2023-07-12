import { useState } from "react";
import { fetchGptArticleCore, gptPromptBuilder } from "../../../lib/gpt";
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
  };

  return {
    fetchFromGPT,
    isLoading,
    currentMessage,
  };
};
