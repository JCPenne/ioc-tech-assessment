import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { User } from '../interfaces';

const dummyusers = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    city: 'New York',
    registered_date: '2022-01-01',
    is_private: false,
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@example.com',
    city: 'Los Angeles',
    registered_date: '2022-02-01',
    is_private: true,
  },
];

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
    accessorKey: 'is_private',
    header: 'Private',
  },
];

export default function UserTable() {
  return (
    <MaterialReactTable
      data={dummyusers}
      columns={columns}
    />
  );
}
