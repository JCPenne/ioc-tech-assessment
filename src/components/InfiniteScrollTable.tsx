// React Dependencies
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 3rd Party Libraries
import {
  MaterialReactTable,
  MRT_Virtualizer,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  type MRT_ColumnDef,
  MRT_ColumnOrderState,
} from 'material-react-table';
import { useInfiniteQuery, useQuery } from 'react-query';

// Constants
import { QUERY_KEYS } from '../constants';
import { IOC_BACKEND } from '../fetchers/config';

interface InfiniteScrollTableProps {
  columns: MRT_ColumnDef<any>[];
  endpoints: string[];
}

export const InfiniteScrollTable = ({ columns, endpoints }: InfiniteScrollTableProps) => {
  const [FETCH_DATA, FETCH_DATA_TOTAL] = endpoints;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data: dataTotal } = useQuery({
    queryKey: [`${QUERY_KEYS.TableData}-${FETCH_DATA}`],
    queryFn: async () => {
      const response = await fetch(`${IOC_BACKEND}${FETCH_DATA_TOTAL}`);

      const totalDataLength = await response.json();

      return totalDataLength;
    },
  });

  const { data, fetchNextPage, isError, isFetching } = useInfiniteQuery({
    queryKey: [`${QUERY_KEYS.TableData}`, columnFilters, globalFilter, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL(`${IOC_BACKEND}${FETCH_DATA}`);
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
      if (flatData.length > 0) {
        rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      }
    } catch (error) {
      console.log(error);
    }
  }, [sorting, columnFilters, globalFilter, flatData]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  //Casting this to an array of strings isn't ideal but we know we're providing an accessorKey.
  //The table library types the accessorKey as optional, which throws TS errors due to typing.
  const [myColumnOrder, setMyColumnOrder] = useState<MRT_ColumnOrderState>(
    columns.map(c => c.accessorKey) as string[]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={flatData}
      state={{
        columnFilters,
        globalFilter,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
        columnOrder: myColumnOrder,
      }}
      enablePagination={false}
      enableColumnOrdering
      enableRowVirtualization
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { maxHeight: '600px' },
        onScroll: event => fetchMoreOnBottomReached(event.currentTarget),
      }}
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      onColumnOrderChange={setMyColumnOrder}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
      rowVirtualizerProps={{ overscan: 4 }}
    />
  );
};
