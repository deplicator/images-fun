import {
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useRef } from "react";

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  const handleChange = (event: { target: { files: any } }) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      axios
        .post("http://localhost:3001/api/images", {
          name: event.target.files[0].name,
          base64: reader.result,
          tags: [],
        })
        .then((response) => {
          update(true);
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    };
    reader.onerror = (error) => {
      console.error("Error: ", error);
    };
  };

  return (
    <Dialog open={isOpen} maxWidth="sm" fullWidth onClose={handleClose}>
      <DialogTitle
        sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
      >
        Upload Image
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Name" />
          <TextField label="Tags" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" component="label" onClick={handleClick}>
          Upload
        </Button>
        <input
          hidden
          accept="image/*"
          ref={hiddenFileInput}
          onChange={handleChange}
          type="file"
        />
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
