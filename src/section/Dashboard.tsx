'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import WeatherWidget from './WeatherWidget';

import { fetchGeoCoords } from '@/service/weather';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

export default function WeatherDashboard() {
  const [cityInput, setCityInput] = useState('');
  const [err, setErr] = useState('');
  const [widgets, setWidgets] = useState<
    { name: string; lat: string; lon: string }[]
  >([
    { name: 'singapore', lat: '1.3521', lon: '103.8198' },
    { name: 'london', lat: '51.5074', lon: '-0.1278' },
    { name: 'new york', lat: '40.7128', lon: '-74.0060' },
    { name: 'tokyo', lat: '35.682839', lon: '139.759455' },
  ]);

  const [fetching, setFetching] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value);
    setErr('');
  };

  const addWidget = async () => {
    const city = cityInput.trim().toLowerCase();
    if (!city) return;
    if (widgets.find((item) => item.name.toLowerCase() === city)) {
      setErr('City already added');
      return;
    }
    setErr('');
    setFetching(true);
    const coords = await fetchGeoCoords(city);
    setFetching(false);
    if (!coords) {
      setErr('City not found');

      return;
    }
    const { lat, lon } = coords;

    setWidgets([...widgets, { name: city, lat, lon }]);
    setCityInput('');
  };

  const removeWidget = (index: number) => {
    const updated = [...widgets];
    updated.splice(index, 1);
    setWidgets(updated);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex(
        (item) => item.name === (active.id as string)
      );
      const newIndex = widgets.findIndex(
        (item) => item.name === (over.id as string)
      );
      setWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex gap-4 mb-6">
        <div>
          <Input
            autoFocus
            placeholder="Enter city name"
            value={cityInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addWidget();
              }
            }}
            className="max-w-[300px]"
          />
          <span className="text-xs ml-1 font-medium text-destructive">
            {err}
          </span>
        </div>
        <Button disabled={fetching} onClick={addWidget}>
          Add Widget
        </Button>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        sensors={[mouseSensor]}
      >
        <SortableContext
          items={widgets.map((city) => city.name)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-6">
            {widgets.map((city, index) => (
              <WeatherWidget
                key={city.name}
                city={city.name}
                lat={city.lat}
                lon={city.lon}
                onDelete={() => removeWidget(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
