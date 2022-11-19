import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import { APIHost } from "./constants";
import { emptyImageData, IImageData } from "./App";

const ViewImageDialog = ({
  isOpen,
  setOpen,
  imageId,
  update,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  imageId: number;
  update: Dispatch<SetStateAction<boolean>>;
}) => {
  const [imageData, setImageData] = useState<IImageData>(emptyImageData);

  const handleClose = () => {
    setImageData(emptyImageData);
    setOpen(false);
  };

  const handleNameChange = (event: { target: { value: any } }) => {
    setImageData((prev) => ({
      ...prev,
      name: event.target.value,
    }));
  };

  const handleTagsChange = (event: { target: { value: any } }) => {
    setImageData((prev) => ({
      ...prev,
      tags: event.target.value,
    }));
  };

  const handleActionClick = () => {
    const { id, base64, ...updateData } = imageData;
    axios
      .patch(`${APIHost}images/${imageId}`, updateData)
      .then((response) => {
        update(true);
        handleClose();
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  // initialize image data
  useEffect(() => {
    if (isOpen) {
      axios.get(`${APIHost}images/${imageId}`).then((response) => {
        setImageData((prev) => ({
          ...prev,
          name: response.data.name,
          tags: response.data.tags,
          base64: response.data.base64,
        }));
      });
    }
  }, [imageId, isOpen]);

  return (
    <Dialog open={isOpen} maxWidth="sm" fullWidth onClose={handleClose}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ImageIcon />
          <Typography variant="h6">{imageData.name}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box
            component="img"
            alt={imageData.name}
            src={imageData.base64}
            loading="lazy"
          />
          <TextField
            // TODO: toggle editing would be cool
            label="Name"
            value={imageData.name}
            onChange={handleNameChange}
          />
          <TextField
            label="Tags"
            value={imageData.tags}
            onChange={handleTagsChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            // TODO: disabled on nothing to save conditions
            onClick={handleActionClick}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewImageDialog;
