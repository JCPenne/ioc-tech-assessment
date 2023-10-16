import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { User } from '../interfaces';
import { useEffect, useState } from 'react';

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

export default function UserTable() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <MaterialReactTable
      data={data}
      columns={columns}
    />
  );
}
