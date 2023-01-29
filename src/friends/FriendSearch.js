import React, { useState } from "react";

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if (searchInput.length > 0 && props.data.length > 0) {
    props.data.filter((user) => {
      return user.username.match(searchInput);
    });
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Search here"
        onChange={handleChange}
        value={searchInput}
      />

      <table>
        {props.data.length > 0 ? (
          props.data.map((user, index) => {
            <div>
              <p>{user.username}</p>
            </div>;
          })
        ) : (
          <>No data found</>
        )}
      </table>
    </div>
  );
};

export default SearchBar;
