import express, { Request, Response } from "express";
import {
  createImage,
  getImageById,
  removeImage,
  searchAll,
  updateImage,
} from "./services";
import { BaseImage, Image } from "./interfaces";

export const imagesRouter = express.Router();

// GET all images
imagesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const items: Image[] = await searchAll(req.query);

    res.status(200).send(items);
  } catch (e) {
    res.status(500).send("problem");
  }
});

// GET an image
imagesRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: Image = await getImageById(id);

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send("item not found");
  } catch (e) {
    console.log(e);
    res.status(500).send("problem");
  }
});

// POST new image
imagesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const item: BaseImage = req.body;
    const newItem = await createImage(item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send("problem");
  }
});

// PATCH an image
imagesRouter.patch("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const itemUpdate: Image = req.body;

    const existingItem: Image = await getImageById(id);

    if (existingItem) {
      const updatedItem = await updateImage(id, itemUpdate);
      return res.status(200).json(updatedItem);
    }

    res.status(404).json("not found");
  } catch (e) {
    res.status(500).send("problem");
  }
});

// DELETE an image
imagesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await removeImage(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send("problem");
  }
});
