import { useUser } from '../hooks/useUser';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export function Header() {
  const { user, logIn, logOut, fetchColumnOrder, saveColumnOrder } = useUser();

  function handleLogIn() {
    if (!user) {
      logIn();
    }
    if (user) {
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
          {user !== undefined && (
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
            onClick={handleLogIn}
          >
            {user === undefined ? 'Login' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
