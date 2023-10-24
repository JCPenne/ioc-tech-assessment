import { InfiniteScrollTable } from './components/InfiniteScrollTable';
import { Header } from './components/Header';
import { UserProvider } from './providers/UserProvider';
import { MRT_ColumnDef } from 'material-react-table';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ENDPOINT } from './fetchers/config';

const queryClient = new QueryClient();

const columns: MRT_ColumnDef<any>[] = [
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
    accessorKey: 'full_name',
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
    accessorFn: row => {
      const date = new Date(row.registered_date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    header: 'Registered Date',
  },
  {
    accessorKey: 'is_private',
    accessorFn: row => row.is_private.toString(),
    header: 'Private',
  },
];

//This would normally be a route-specific page, not App
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Header />
        <InfiniteScrollTable
          columns={columns}
          endpoints={[ENDPOINT.USER_DATA, ENDPOINT.USER_COUNT]}
        />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
