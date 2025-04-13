'use client';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { useState } from 'react';

function Widget({ id }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white shadow rounded-xl"
    >
      Widget {id}
    </div>
  );
}

function Dashboard() {
  const [items, setItems] = useState(['1', '2', '3', '4', '5', '6', '7', '8']);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }: any) => {
        if (over && active.id !== over.id) {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          setItems(arrayMove(items, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-4">
          {items.map((id) => (
            <Widget key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
export default Dashboard;
