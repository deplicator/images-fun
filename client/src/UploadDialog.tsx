import {
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

const UploadDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle
        sx={{ mb: 2, backgroundColor: (theme) => theme.palette.primary.main }}
      >
        Upload Image
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Name" />
          <TextField label="Tags" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" component="label">
          Upload
          <input hidden accept="image/*" multiple type="file" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
