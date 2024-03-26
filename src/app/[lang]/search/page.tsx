
import { unstable_noStore as noStore } from 'next/cache';
import React from 'react';

const Search = async () => {
  noStore();
  return (
    <div>Search</div>
  );
};

export default Search;