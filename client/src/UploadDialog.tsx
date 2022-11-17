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
import { Dispatch, SetStateAction, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { emptyImageData, IImageData } from "./App";

const UploadDialog = ({
  isOpen,
  setOpen,
  update,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  update: Dispatch<SetStateAction<boolean>>;
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    axios
      .post("http://localhost:3001/api/images", imageData)
      .then((response) => {
        update(true);
        handleClose();
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

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
          <Typography variant="h6">Add Image</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleSelectImageClick}>
            Select Image
          </Button>
          <TextField
            label="Name"
            value={imageData.name}
            onChange={handleNameChange}
          />
          <TextField label="Tags" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUploadClick}>
            Upload
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
