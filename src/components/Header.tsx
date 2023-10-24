import { useUser } from '../hooks/useUser';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export function Header() {
  const { user, logIn, logOut, fetchColumnOrder, saveColumnOrder } = useUser();

  function handleUserAuth() {
    if (!user?.email) {
      logIn();
    }
    if (user?.email) {
      logOut();
    }
  }
  function handleLoad() {
    fetchColumnOrder();
  }
  function handleSave() {
    saveColumnOrder(user?.columnOrder);
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
          >
            Isle Of Code
          </Typography>
          {user?.email !== undefined && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography
                variant='h6'
                sx={{ color: 'white' }}
              >
                {user.email}
              </Typography>
              <Button
                variant='outlined'
                color='inherit'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                onClick={handleLoad}
              >
                Load
              </Button>
            </Box>
          )}
          <Button
            color='inherit'
            onClick={handleUserAuth}
          >
            {user?.email === undefined ? 'Login' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
