import { useState } from "react";
import { fetchGptArticleCore, gptPromptBuilder } from "../../../lib/gpt";

export const useGPT = () => {
    const [ currentMessage, setCurrentMessage ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);

    const fetchFromGPT = async (message: string) => {
        if (isLoading) return;
        setIsLoading(false);
        const data = await fetchGptArticleCore(gptPromptBuilder(message), (_, total) => setCurrentMessage(total));
        setCurrentMessage(data);
        setIsLoading(true);
    }

    return {
        fetchFromGPT,
        isLoading,
        currentMessage
    }
}