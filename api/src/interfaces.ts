export interface BaseImage {
  name: string;
  tags: string;
  base64: string;
}

export interface Image extends BaseImage {
  id: number;
}
