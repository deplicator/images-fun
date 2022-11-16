import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  ImageListItemBar,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import UploadDialog from "./UploadDialog";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface IImageData {
  base64: string;
  id: number;
  name: string;
  tags: string[];
}

const App = () => {
  const [theStuff, setTheStuff] = useState<IImageData[]>([]);
  const [needNewStuff, setNeedNewStuff] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const showImageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const closeImageMenu = () => {
    setMenuAnchor(null);
  };

  // get the stuff on load
  useEffect(() => {
    if (needNewStuff) {
      axios.get("http://localhost:3001/api/images").then((response) => {
        setTheStuff(response.data as IImageData[]);
      });
      setNeedNewStuff(false);
    }
  }, [needNewStuff]);

  return (
    <>
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 3 }}
        >
          <TextField label="Search" sx={{ width: "60vw" }} />
          <Button variant="contained" onClick={() => setOpenUploadDialog(true)}>
            Upload
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {theStuff.map((item) => (
            <Grid item xs={3} key={item.id}>
              <Box
                component="img"
                height={300}
                width="100%"
                alt={item.name}
                src={item.base64}
                loading="lazy"
                sx={{ objectFit: "cover" }}
              />
              <ImageListItemBar
                title={item.name}
                subtitle={item.tags}
                position="below"
                actionIcon={
                  <IconButton
                    aria-label={`info about ${item.name}`}
                    onClick={showImageMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeImageMenu}
      >
        <MenuItem aria-label="something" onClick={closeImageMenu}>
          something
        </MenuItem>
      </Menu>

      <UploadDialog
        isOpen={openUploadDialog}
        setOpen={setOpenUploadDialog}
        update={setNeedNewStuff}
      />
    </>
  );
};

export default App;
