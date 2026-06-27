import { useMemo, useState } from "react";
import { tools } from "../data/tools";
import { categories } from "../data/categories";

export function useSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return tools;
    
    const searchTerms = query.toLowerCase().split(" ");
    
    return tools.filter((tool) => {
      const textToSearch = [
        tool.name.toLowerCase(),
        tool.description.toLowerCase(),
        tool.category.toLowerCase(),
        ...tool.keywords.map(k => k.toLowerCase())
      ].join(" ");
      
      return searchTerms.every(term => textToSearch.includes(term));
    });
  }, [query]);

  return { query, setQuery, results };
}
