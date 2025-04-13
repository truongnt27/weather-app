'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import WeatherWidget from './WeatherWidget';

export default function WeatherDashboard() {
  const [cityInput, setCityInput] = useState('');
  const [widgets, setWidgets] = useState<string[]>([
    'Singapore',
    'New York',
    'London',
  ]);

  const addWidget = () => {
    if (!cityInput.trim()) return;
    setWidgets([...widgets, cityInput]);
    setCityInput('');
  };

  const removeWidget = (index: number) => {
    const updated = [...widgets];
    updated.splice(index, 1);
    setWidgets(updated);
  };

  const moveWidget = (fromIndex: number, toIndex: number) => {
    const updated = [...widgets];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setWidgets(updated);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Enter city name"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          className="max-w-[300px]"
        />
        <Button onClick={addWidget}>Add Widget</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {widgets.map((city, index) => (
          <WeatherWidget
            key={index}
            index={index}
            city={city}
            onDelete={() => removeWidget(index)}
            moveWidget={moveWidget}
          />
        ))}
      </div>
    </div>
  );
}
