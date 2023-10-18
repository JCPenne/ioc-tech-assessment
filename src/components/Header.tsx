import { useUser } from '../contexts/user';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export function Header() {
  const { user, logIn, logOut } = useUser();
  console.log(user);

  function handleClick() {
    if (!user) {
      logIn();
    }
    if (user) {
      logOut();
    }
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
              >
                Save
              </Button>
              <Button
                variant='outlined'
                color='inherit'
              >
                Load
              </Button>
            </Box>
          )}
          <Button
            color='inherit'
            onClick={handleClick}
          >
            {user === undefined ? 'Login' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
