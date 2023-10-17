import { UserTable } from './components/UserTable';
import { Header } from './components/Header';
import { UserProvider } from './contexts/user';

function App() {
  return (
    <UserProvider>
      <Header />
      <UserTable />
    </UserProvider>
  );
}

export default App;
