import { css } from "@emotion/css";
import { ReactElement, useEffect, useState } from "react";
import { API_URL } from "../../../config";
interface SearchBarProps {
  maxSuggestions?: number;
}

function SearchBar({ maxSuggestions = 30 }: SearchBarProps): ReactElement {
  const [searchContent, setSearchContent] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // When search content change
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${API_URL}/courses?query=${searchContent}&max=${maxSuggestions}`
      );
      setSearchSuggestions(await res.json());
    })();
  }, [searchContent, maxSuggestions]);

  function searchHandler() {}

  return (
    <div className="search-bar">
      <input
        onChange={(event) => {
          setSearchContent(event.currentTarget.value);
        }}
        type="text"
        placeholder="Search a course..."
      />
      <button onClick={searchHandler}>SEARCH</button>
      <div
        className={css`
          display: flex;
          flex-direction: column;
        `}
      >
        {searchSuggestions.map((s) => (
          <div key={s}>{s}</div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
