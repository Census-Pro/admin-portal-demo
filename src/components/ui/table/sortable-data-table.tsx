'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { IconGripVertical } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface SortableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  onReorder?: (newData: TData[]) => void;
}

function DragHandle({ attributes, listeners, isDragging }: any) {
  return (
    <div
      {...attributes}
      {...listeners}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isDragging
          ? 'text-primary cursor-grabbing'
          : 'text-muted-foreground cursor-grab'
      )}
      title="Drag to reorder"
    >
      <IconGripVertical className="h-4 w-4" />
    </div>
  );
}

function SortableRow({ row, ...props }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ id: (row.original as { id: string }).id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && 'selected'}
      className={cn(
        'group relative transition-colors',
        isDragging && 'ring-primary/30 bg-muted/60 opacity-40 ring-2',
        isOver && !isDragging && 'bg-accent/40',
        !isDragging && 'hover:bg-muted/50'
      )}
      {...props}
    >
      <TableCell className="w-[50px] py-2">
        <DragHandle
          attributes={attributes}
          listeners={listeners}
          isDragging={isDragging}
        />
      </TableCell>
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

/** Snapshot row rendered inside the DragOverlay (the "floating card") */
function OverlayRow({ row }: { row: Row<any> }) {
  return (
    <TableRow className="bg-background ring-primary/40 scale-[1.02] rounded-md opacity-95 shadow-2xl ring-2">
      <TableCell className="w-[50px] py-2">
        <div className="text-primary flex h-8 w-8 items-center justify-center rounded-md">
          <IconGripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.4' }
    }
  })
};

export function SortableDataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  totalItems,
  onReorder
}: SortableDataTableProps<TData, TValue>) {
  const [items, setItems] = React.useState(data);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder?.(newItems);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeRow = React.useMemo(
    () =>
      activeId
        ? (table
            .getRowModel()
            .rows.find(
              (row) => (row.original as { id: string }).id === activeId
            ) ?? null)
        : null,
    [activeId, table]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-[50px]">
                  <span className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase select-none">
                    Order
                  </span>
                </TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => <SortableRow key={row.id} row={row} />)
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </SortableContext>
          </TableBody>
        </Table>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeRow ? (
            <Table>
              <TableBody>
                <OverlayRow row={activeRow} />
              </TableBody>
            </Table>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
