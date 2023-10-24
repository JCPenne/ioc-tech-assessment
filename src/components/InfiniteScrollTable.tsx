// React Dependencies
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 3rd Party Libraries
import {
  MaterialReactTable,
  MRT_Virtualizer,
  MRT_SortingState,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useInfiniteQuery, useQuery } from 'react-query';

// Hooks
import { useUser } from '../hooks/useUser';

// Constants
import { QUERY_KEYS, fetchNewTableDataThreshold } from '../constants';
import { IOC_BACKEND } from '../fetchers/config';

interface Props {
  columns: MRT_ColumnDef<any>[];
  endpoints: string[];
}

export const InfiniteScrollTable = ({ columns, endpoints }: Props) => {
  const { user, setColumnOrder } = useUser();
  const [FETCH_DATA, FETCH_DATA_TOTAL] = endpoints;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

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
    queryKey: [`${QUERY_KEYS.TableData}`, sorting],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL(`${IOC_BACKEND}${FETCH_DATA}`);
      url.searchParams.set('_page', `${pageParam}`);

      const response = await fetch(url);
      const json = await response.json();

      return json;
    },
    getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  
  const flatData = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data]);
  const totalFetched = flatData.length;

  const fetchNextDataChunk = useCallback(
    (containerRefElement: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < fetchNewTableDataThreshold &&
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
  }, [sorting]);

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
      onSortingChange={setSorting}
      onColumnOrderChange={newColumnOrder => {
        setColumnOrder(newColumnOrder as string[]);
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerProps={{ overscan: 4 }}
      enableColumnFilters={false}
    />
  );
};
