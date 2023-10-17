import { useUser } from '../contexts/user';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export function Header() {
  const { user, logIn, logOut } = useUser();
  console.log('user', user);
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
          <Button
            color='inherit'
            onClick={() => handleClick()}
          >
            {!user ? 'Login' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
