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
import { useInfiniteQuery, useQuery } from 'react-query';

// Hooks
import { useUser } from '../hooks/useUser';

// Constants
import { QUERY_KEYS } from '../constants';
import { IOC_BACKEND } from '../fetchers/config';

interface InfiniteScrollTableProps {
  columns: MRT_ColumnDef<any>[];
  endpoints: string[];
}

export const InfiniteScrollTable = ({ columns, endpoints }: InfiniteScrollTableProps) => {
  const { user, setColumnOrder } = useUser();
  const [FETCH_DATA, FETCH_DATA_TOTAL] = endpoints;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  //We would need to check the data that's returned from both queries for JSON validity and what the structure looks like.
  //Likely an abstracted generic data checker
  const { data: dataTotal } = useQuery({
    queryKey: [`${QUERY_KEYS.TableData}-${FETCH_DATA}`],
    queryFn: async () => {
      const response = await fetch(`${IOC_BACKEND}${FETCH_DATA_TOTAL}`);
      const totalDataLength = await response.json();

      return totalDataLength;
    },
  });
  //Normally the Backend API would return metadata showing total # of pages that can be returned
  const { data, fetchNextPage, isError, isFetching } = useInfiniteQuery({
    queryKey: [`${QUERY_KEYS.TableData}`, columnFilters, globalFilter, sorting],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL(`${IOC_BACKEND}${FETCH_DATA}`);
      url.searchParams.set('_page', `${pageParam}`);

      const response = await fetch(url);
      const json = await response.json();

      return json;
    },
    //look into this
    getNextPageParam: (_, allPages) => allPages.length + 1,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data]);
  const totalFetched = flatData.length;

  //look into useCallback to remember
  const fetchNextDataChunk = useCallback(
    (containerRefElement: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 50 &&
          !isFetching &&
          totalFetched < dataTotal
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, dataTotal]
  );
  //Need better error handling in this useEffect
  useEffect(() => {
    try {
      if (flatData.length > 0) {
        rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      }
    } catch (error) {
      console.log(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  //Look into this
  useEffect(() => {
    fetchNextDataChunk(tableContainerRef.current);
  }, [fetchNextDataChunk]);

  const generateColumnOrder = () => {
    let columnOrder;

    if (
      user?.columnOrder &&
      Array.isArray(user.columnOrder) &&
      user.columnOrder.every((item: any) => typeof item === 'string')
    ) {
      columnOrder = user.columnOrder;
    } else {
      columnOrder = columns.map(c => c.accessorKey);
    }
    return columnOrder as string[];
  };

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
        columnOrder: generateColumnOrder(),
      }}
      enablePagination={false}
      enableColumnOrdering
      enableRowVirtualization
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { maxHeight: '800px' },
        onScroll: event => fetchNextDataChunk(event.currentTarget),
      }}
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      onColumnOrderChange={newColumnOrder => setColumnOrder(newColumnOrder)}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerProps={{ overscan: 4 }}
      enableColumnFilters={false}
    />
  );
};
