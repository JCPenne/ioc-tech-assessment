import { UserTable } from './components/UserTable';
import { Header } from './components/Header';
import { UserProvider } from './providers/UserProvider';

function App() {
  return (
    <UserProvider>
      <Header />
      <UserTable />
    </UserProvider>
  );
}

export default App;
