import { Button, Stack, TextField } from "@mui/material";

const App = () => {
  return (
    <Stack direction='row' justifyContent='space-between' spacing={2} sx={{ p: 3 }}>
      <TextField label='Search' sx={{ width: '60vw' }} />
      <Button variant='contained'>Upload</Button>
    </Stack>
  );
}

export default App;
