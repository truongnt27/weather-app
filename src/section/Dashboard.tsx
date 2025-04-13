'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import WeatherWidget from './WeatherWidget';

import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

export default function WeatherDashboard() {
  const [cityInput, setCityInput] = useState('');
  const [widgets, setWidgets] = useState<string[]>([
    'Singapore',
    'New York',
    'London',
    'Tokyo',
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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = widgets.indexOf(active.id as string);
      const newIndex = widgets.indexOf(over.id as string);
      setWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
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
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-6">
            {widgets.map((city, index) => (
              <WeatherWidget
                key={city}
                city={city}
                onDelete={() => removeWidget(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
