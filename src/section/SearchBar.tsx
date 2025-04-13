import { useState } from 'react';

export default function SearchBar({
  onAddCity,
}: {
  onAddCity: (city: string) => void;
}) {
  const [city, setCity] = useState('');

  return (
    <form>
      <input
        type="text"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={() => city && onAddCity(city)}>Add City</button>
    </form>
  );
}
