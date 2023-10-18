// React Dependencies
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 3rd Party Libraries
import {
  MaterialReactTable,
  MRT_Virtualizer,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  type MRT_ColumnDef,
} from 'material-react-table';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';

// Types
import { UserDataObject } from '../interfaces';

const columns: MRT_ColumnDef<UserDataObject>[] = [
  {
    accessorKey: 'id',
    header: '#',
    enableColumnDragging: false,
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
  },
  {
    accessorFn: row => `${row.first_name} ${row.last_name}`,
    header: 'Full Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorFn: row => {
      const date = new Date(row.registered_date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    header: 'Registered Date',
  },
  {
    accessorFn: row => `${row.is_private.toString()}`,
    header: 'Private',
  },
];
//Hardcoded. Would want a better way to discover the total data length, json-server limitation
const dataTotal = 100;

const InfiniteScrollTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching } = useInfiniteQuery<UserDataObject>({
    queryKey: ['table-data', columnFilters, globalFilter, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/users`);
      url.searchParams.set('_page', `${pageParam}`);
      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    getNextPageParam: (_, allPages) => allPages.length + 1,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  const flatData = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data]);
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 100 &&
          !isFetching &&
          totalFetched < dataTotal
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, dataTotal]
  );

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.log(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <MaterialReactTable
      columns={columns}
      data={flatData}
      enablePagination={false}
      enableRowVirtualization
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { maxHeight: '600px' },
        onScroll: event => fetchMoreOnBottomReached(event.currentTarget),
      }}
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      state={{
        columnFilters,
        globalFilter,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
      rowVirtualizerProps={{ overscan: 4 }}
    />
  );
};

const queryClient = new QueryClient();

export const UserTable = () => (
  <QueryClientProvider client={queryClient}>
    <InfiniteScrollTable />
  </QueryClientProvider>
);
