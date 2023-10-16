// React Dependencies
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 3rd Party Libraries
import {
  MaterialReactTable,
  MRT_Virtualizer,
  type MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_SortingState,
} from 'material-react-table';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';

// Types
import { User } from '../interfaces';

const columns: MRT_ColumnDef<User>[] = [
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

const dataTotal = 100;

const queryClient = new QueryClient();

const UserTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching } = useInfiniteQuery<User>({
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
    refetchOnWindowFocus: true,
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
    [fetchNextPage, isFetching, totalFetched]
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
      enableRowNumbers
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
    />
  );
};

export const InfiniteScrollTable = () => (
  <QueryClientProvider client={queryClient}>
    <UserTable />
  </QueryClientProvider>
);
