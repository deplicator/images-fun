import { useEffect, useState, KeyboardEvent, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  ImageListItemBar,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { APIHost } from "./constants";
import UploadDialog from "./UploadDialog";
import ViewImageDialog from "./ViewImageDialog";

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
  const [includeTags, setIncludeTags] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentImageId, setCurrentImageId] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openViewImageDialog, setOpenViewImageDialog] = useState(false);
  const [maxImageCount, setMaxImageCount] = useState(0);

  const searchForImage = useCallback(() => {
    axios
      .get(`${APIHost}images?search=${searchTerm}&includetags=${includeTags}`)
      .then((response) => {
        setTheStuff(response.data as IImageData[]);

        // Not ideal, but works without API change
        if (searchTerm === "") {
          setMaxImageCount(response.data.length);
        }
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

  const viewEditImage =
    (id: number) => (event: React.MouseEvent<HTMLElement>) => {
      setCurrentImageId(id);
      setOpenViewImageDialog(true);
      setMenuAnchor(null);
    };

  const deleteImage = () => {
    axios.delete(`${APIHost}images/${currentImageId}`).then((response) => {
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
        <Card sx={{ p: 2, mb: 4 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              label={`Search by Names${includeTags ? " and Tags" : ""}`}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ width: "100%", minWidth: 200 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchTerm("");
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={searchForImage}
              sx={{ height: 48, minWidth: 140 }}
            >
              Search
            </Button>
            <FormGroup sx={{ minWidth: 140 }}>
              <FormControlLabel
                control={<Checkbox onChange={handleCheck} />}
                label="Include Tags"
              />
            </FormGroup>
          </Stack>
        </Card>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">
            {theStuff.length === maxImageCount
              ? `Showing All ${maxImageCount} Images`
              : `Showing ${theStuff.length} out of ${maxImageCount} Images`}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setOpenUploadDialog(true)}
            sx={{ minWidth: 150 }}
          >
            Add Image
          </Button>
        </Stack>
        <Grid container spacing={2} sx={{ pt: 4 }}>
          {theStuff.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                elevation={4}
                sx={{
                  p: 1,
                  backgroundColor: cardColorOptions[item.name.length % 6],
                  border: "1px solid grey",
                }}
              >
                <Box
                  component="img"
                  height={300}
                  width="100%"
                  alt={item.name}
                  src={item.base64}
                  loading="lazy"
                  onClick={viewEditImage(item.id || 0)}
                  sx={{ cursor: "pointer", objectFit: "cover" }}
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeImageMenu}
      >
        <MenuItem onClick={viewEditImage(currentImageId)}>
          <VisibilityIcon sx={{ pr: 1 }} color="primary" />
          <Typography color={(theme) => theme.palette.primary.main}>
            View & Edit
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={deleteImage}>
          <DeleteForeverIcon sx={{ pr: 1 }} color="warning" />
          <Typography color={(theme) => theme.palette.warning.main}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      <ViewImageDialog
        isOpen={openViewImageDialog}
        setOpen={setOpenViewImageDialog}
        imageId={currentImageId}
        update={setNeedNewStuff}
      />

      <UploadDialog
        isOpen={openUploadDialog}
        setOpen={setOpenUploadDialog}
        update={setNeedNewStuff}
      />
    </>
  );
};

export default App;
