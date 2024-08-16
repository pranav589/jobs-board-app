import React, { forwardRef, useMemo, useState } from "react";
import { Input } from "./ui/input";
import cities from "@/lib/cities-list";

export default forwardRef(function LocationInput(
  { onLocationSelected, ...props },
  ref,
) {
  const [locationSearch, setLocationSearch] = useState("");
  const [hasFocus, setHasFocus] = useState(false);

  const citiesData = useMemo(() => {
    if (!locationSearch.trim()) return [];

    const searchWords = locationSearch.split(" ");

    return cities
      .map((city) => `${city.name}, ${city.subcountry}, ${city.country}`)
      .filter(
        (city) =>
          city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
          searchWords.every((word) =>
            city.toLowerCase().includes(word.toLowerCase()),
          ),
      )
      .slice(0, 5);
  }, [locationSearch]);

  return (
    <div className="relative">
      <Input
        placeholder="Search for a city"
        type="search"
        value={locationSearch}
        {...props}
        ref={ref}
        onChange={(e) => setLocationSearch(e.target.value)}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      />
      {locationSearch.trim() && hasFocus && (
        <div className="absolute w-full bg-background shadow-xl border-x border-b rounded-b-lg z-20 divide-y">
          {!citiesData.length && <p className="p-3">No results found</p>}
          {citiesData.map((city) => (
            <button
              key={city}
              className="block w-full text-start p-2"
              onMouseDown={(e) => {
                e.preventDefault();
                onLocationSelected(city);
                setLocationSearch("");
              }}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
