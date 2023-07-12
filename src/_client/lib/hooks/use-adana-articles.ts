import { useEffect, useState } from "react";
import { fetchAllLearnArticles } from "../../../lib/adana";

export const useAdanaArticles = () => {
    const [ articles, setArticles ] = useState<Awaited<ReturnType<typeof fetchAllLearnArticles>>>([]);
    const [ articlesLoading, setArticlesLoading ] = useState(false);

    const refreshArticles = async () => {
        setArticlesLoading(true);
        fetchAllLearnArticles()
        .then((data) => setArticles(data))
        .finally(() => setArticlesLoading(false));
    }

    useEffect(() => {
        if (articlesLoading || articles.length > 0) return;
        refreshArticles();
    }, [ articlesLoading, articles.length ]);

    return {
        articles,
        articlesLoading
    }
};