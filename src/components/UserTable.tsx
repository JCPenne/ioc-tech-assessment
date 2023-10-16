// React Dependencies
import { UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
    accessorKey: 'registered_date',
    header: 'Registered Date',
  },
  {
    accessorFn: row => `${row.is_private.toString()}`,
    header: 'Private',
  },
];

const dataTotal = 100;

const UserTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching } = useInfiniteQuery<User>({
    queryKey: ['table-data'],
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL(`http://localhost:3000/users`);
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
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
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
  // scroll to top of table when sorting or filters change
  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    if (rowVirtualizerInstanceRef.current) {
      try {
        rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      } catch (error) {
        console.log(error);
      }
    }
  }, [sorting, columnFilters, globalFilter]);

  //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <MaterialReactTable
      columns={columns}
      data={flatData}
      enablePagination={false}
      enableRowNumbers
      enableRowVirtualization //optional, but recommended if it is likely going to be more than 100 rows
      muiTableContainerProps={{
        ref: tableContainerRef, //get access to the table container element
        sx: { maxHeight: '600px' }, //give the table a max height
        onScroll: (
          event: UIEvent<HTMLDivElement> //add an event listener to the table container element
        ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              children: 'Error loading data',
            }
          : undefined
      }
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
queryClient.invalidateQueries('table-data');

export const InfiniteScrollTable = () => (
  <QueryClientProvider client={queryClient}>
    <UserTable />
  </QueryClientProvider>
);
