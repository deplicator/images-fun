import {
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { emptyImageData, IImageData } from "./App";
import { APIHost } from "./constants";

const UploadDialog = ({
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
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const exitExisting = imageId !== 0;
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

  const handleSelectImageClick = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  const handleInputChange = (event: { target: { files: any } }) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setImageData((prev) => ({
        ...prev,
        name: event.target.files[0].name,
        base64: reader.result as string,
      }));
    };
    reader.onerror = (error) => {
      console.error("Error: ", error);
    };
  };

  const handleActionClick = () => {
    if (exitExisting) {
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
    } else {
      axios
        .post(`${APIHost}images`, imageData)
        .then((response) => {
          update(true);
          handleClose();
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  };

  // initialize if editing image name and tags
  useEffect(() => {
    if (exitExisting) {
      axios.get(`${APIHost}images/${imageId}`).then((response) => {
        setImageData((prev) => ({
          ...prev,
          name: response.data.name,
          tags: response.data.tags,
        }));
      });
    }
  }, [exitExisting, imageId, isOpen]);

  return (
    <Dialog open={isOpen} maxWidth="sm" fullWidth onClose={handleClose}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <AddCircleOutlineIcon />
          <Typography variant="h6">
            {" "}
            {exitExisting ? "Edit Image" : "Add Image"}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {!exitExisting && (
            <Button variant="contained" onClick={handleSelectImageClick}>
              Select Image
            </Button>
          )}
          <TextField
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
            // disabled on nothing to save conditions
            onClick={handleActionClick}
          >
            {exitExisting ? "Save" : "Upload"}
          </Button>
        </Stack>
      </DialogActions>
      <input
        hidden
        accept="image/*"
        ref={hiddenFileInput}
        onChange={handleInputChange}
        type="file"
      />
    </Dialog>
  );
};

export default UploadDialog;
