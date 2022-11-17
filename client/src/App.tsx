import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  ImageListItemBar,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, KeyboardEvent, useCallback } from "react";
import UploadDialog from "./UploadDialog";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";

export interface IImageData {
  id?: number;
  name: string;
  tags: string[];
  base64: string;
}

export const emptyImageData: IImageData = {
  name: "",
  tags: [],
  base64: "",
};

const cardColorOptions = [
  "#66FF00",
  "#1974D2",
  "#08E8DE",
  "#FFF000",
  "#FFAA1D",
  "#FF007F",
];

const App = () => {
  const [theStuff, setTheStuff] = useState<IImageData[]>([]);
  const [needNewStuff, setNeedNewStuff] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [includeTags, setIncludeTags] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const searchForImage = useCallback(() => {
    axios
      .get(
        `http://localhost:3001/api/images?search=${searchTerm}&includetags=${includeTags}`
      )
      .then((response) => {
        setTheStuff(response.data as IImageData[]);
      });
  }, [includeTags, searchTerm]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      searchForImage();
    }
    if (event.key === "Escape") {
      setSearchTerm("");
    }
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTags(event.target.checked);
  };

  const showImageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeImageMenu = () => {
    setMenuAnchor(null);
  };

  // get the stuff when it's needed
  useEffect(() => {
    if (needNewStuff) {
      axios.get("http://localhost:3001/api/images").then((response) => {
        setTheStuff(response.data as IImageData[]);
      });
      setNeedNewStuff(false);
    }
  }, [needNewStuff]);

  // get the stuff when search cleared
  useEffect(() => {
    if (searchTerm === "") {
      searchForImage();
    }
  }, [searchForImage, searchTerm]);

  return (
    <>
      <Container sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: "white", width: "60vw" }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={searchForImage}
            sx={{ minWidth: 150 }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setOpenUploadDialog(true)}
            sx={{ minWidth: 150 }}
          >
            Add Image
          </Button>
        </Stack>
        <FormGroup sx={{ pl: 4 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked onChange={handleCheck} />}
            label="Include Tags in Search"
          />
        </FormGroup>
        <Grid container spacing={2} sx={{ pt: 4 }}>
          {theStuff.map((item) => (
            <Grid item xs={3} key={item.id}>
              <Box
                p={1}
                border="1px solid grey"
                sx={{ backgroundColor: cardColorOptions[item.name.length % 6] }}
              >
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
              </Box>
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
