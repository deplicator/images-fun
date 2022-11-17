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
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  const [currentImageId, setCurrentImageId] = useState(0);
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

  const showImageMenu =
    (id: number) => (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchor(event.currentTarget);
      setCurrentImageId(id);
    };

  const closeImageMenu = () => {
    setMenuAnchor(null);
    setCurrentImageId(0);
  };

  const editImage = () => {
    setOpenUploadDialog(true);
    setMenuAnchor(null);
  };

  const deleteImage = () => {
    axios
      .delete(`http://localhost:3001/api/images/${currentImageId}`)
      .then((response) => {
        setNeedNewStuff(true);
        closeImageMenu();
      });
  };

  // get the stuff when it's needed
  useEffect(() => {
    if (needNewStuff) {
      searchForImage();
      setNeedNewStuff(false);
    }
  }, [needNewStuff, searchForImage]);

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
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                    <IconButton onClick={showImageMenu(item.id || 0)}>
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
        <MenuItem onClick={editImage}>
          <EditIcon sx={{ pr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={deleteImage}>
          <DeleteForeverIcon sx={{ pr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <UploadDialog
        isOpen={openUploadDialog}
        setOpen={setOpenUploadDialog}
        imageId={currentImageId}
        update={setNeedNewStuff}
      />
    </>
  );
};

export default App;
