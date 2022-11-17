export interface BaseImage {
  name: string;
  tags: string[];
  filename: string;
  base64: string;
}

export interface Image extends BaseImage {
  id: number;
}
