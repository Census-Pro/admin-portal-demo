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
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { IconGripVertical } from '@tabler/icons-react';
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { parseAsInteger, useQueryState } from 'nuqs';

interface SortableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  onReorder?: (newData: TData[]) => void;
  pageSizeOptions?: number[];
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
        <TableCell
          key={cell.id}
          style={{
            width: cell.column.columnDef.size
              ? `${cell.column.columnDef.size}px`
              : undefined,
            minWidth: cell.column.columnDef.size
              ? `${cell.column.columnDef.size}px`
              : undefined
          }}
        >
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
        <TableCell
          key={cell.id}
          style={{
            width: cell.column.columnDef.size
              ? `${cell.column.columnDef.size}px`
              : undefined,
            minWidth: cell.column.columnDef.size
              ? `${cell.column.columnDef.size}px`
              : undefined
          }}
        >
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
  onReorder,
  pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
}: SortableDataTableProps<TData, TValue>) {
  const [items, setItems] = React.useState(data);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger
      .withOptions({ shallow: false, history: 'push' })
      .withDefault(10)
  );

  const paginationState: PaginationState = {
    pageIndex: currentPage - 1,
    pageSize: pageSize
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;
    setCurrentPage(pagination.pageIndex + 1);
    setPageSize(pagination.pageSize);
  };

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
    pageCount,
    state: {
      pagination: paginationState,
      sorting
    },
    initialState: {
      columnPinning: { right: ['actions'] }
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true
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

  const tableHeader = (
    <TableHeader className="bg-primary/10">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          <TableHead className="w-[50px]">
            <span className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase select-none">
              Order
            </span>
          </TableHead>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{
                width: header.column.columnDef.size
                  ? `${header.column.columnDef.size}px`
                  : undefined,
                minWidth: header.column.columnDef.size
                  ? `${header.column.columnDef.size}px`
                  : undefined
              }}
            >
              {header.isPlaceholder ? null : header.column.getCanSort() &&
                typeof header.column.columnDef.header === 'string' ? (
                <Button
                  variant="ghost"
                  onClick={header.column.getToggleSortingHandler()}
                  className="-ml-3 h-8 gap-1 select-none"
                >
                  {header.column.columnDef.header}
                  {header.column.getIsSorted() === 'asc' ? (
                    <IconSortAscending className="h-4 w-4 shrink-0" />
                  ) : header.column.getIsSorted() === 'desc' ? (
                    <IconSortDescending className="h-4 w-4 shrink-0" />
                  ) : (
                    <IconArrowsSort className="h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );

  const paginationFooter = (
    <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
      <div className="flex w-full items-center justify-between">
        <div className="text-muted-foreground flex-1 text-sm">
          {totalItems > 0 ? (
            <>
              Showing {paginationState.pageIndex * paginationState.pageSize + 1}{' '}
              to{' '}
              {Math.min(
                (paginationState.pageIndex + 1) * paginationState.pageSize,
                totalItems
              )}{' '}
              of {totalItems} entries
            </>
          ) : (
            'No entries found'
          )}
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={`${paginationState.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={paginationState.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
        <div className="flex w-[150px] items-center justify-center text-sm font-medium">
          {totalItems > 0 ? (
            <>
              Page {paginationState.pageIndex + 1} of {table.getPageCount()}
            </>
          ) : (
            'No pages'
          )}
        </div>
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Go to first page"
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={5}>
                First page
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Go to previous page"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={5}>
                Previous page
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Go to next page"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={5}>
                Next page
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Go to last page"
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={5}>
                Last page
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="w-full space-y-4">
        <ScrollArea className="bg-table h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-240px)]">
          <Table>
            {tableHeader}
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-muted-foreground h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {paginationFooter}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <ScrollArea className="bg-table h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-240px)]">
        <DndContext
          id="sortable-data-table-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Table>
            {tableHeader}
            <TableBody>
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {paginationFooter}
    </div>
  );
}
