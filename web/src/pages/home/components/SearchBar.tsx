import { ReactElement, useEffect, useState } from "react";

interface SearchBarProps {
  a?: string;
}

function SearchBar({ a }: SearchBarProps): ReactElement {
  const [searchContent, setSearchContent] = useState("");
  console.log(process.env.API_URL);

  // When search content change
  useEffect(() => {
    fetch("lochals");
  }, [searchContent]);

  function searchHandler() {}

  const fetchData = () => {};

  return (
    <div>
      <input
        onChange={(event) => {
          setSearchContent(event.currentTarget.value);
        }}
        type="text"
        placeholder="Search a course..."
      />
      <button onClick={searchHandler}>SEARCH</button>
    </div>
  );
}

export default SearchBar;
