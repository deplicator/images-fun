import { BaseImage, Image, Images } from "./interfaces";

let defaultImages: Images = {
  1: {
    id: 1,
    name: "rubber ducky",
    tags: ["duck", "swim"],
    base64:
      "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",
  },
};

let nextIndex = 2;

export const findAll = async (): Promise<Image[]> =>
  Object.values(defaultImages);

export const find = async (id: number): Promise<Image> => defaultImages[id];

export const create = async (newImage: BaseImage): Promise<Image> => {
  const id = nextIndex;

  defaultImages[id] = {
    id,
    ...newImage,
  };

  nextIndex++;

  return defaultImages[id];
};

export const update = async (
  id: number,
  updateImage: BaseImage
): Promise<Image | null> => {
  const image = await find(id);

  if (!image) {
    return null;
  }

  defaultImages[id] = { id, ...updateImage };

  return defaultImages[id];
};

export const remove = async (id: number): Promise<null | void> => {
  const image = await find(id);

  if (!image) {
    return null;
  }

  delete defaultImages[id];
};
