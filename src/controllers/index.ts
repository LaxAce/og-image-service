import { Request, Response } from 'express';
import { generateOgImageService } from '../services';

export const generateOgImageCTRL = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    console.log("xxxxxxx urlll", url)

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    console.log("xxxxxx start generating")

    const imageBase64 = await generateOgImageService(url);
    res.json({ imageBase64 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate image' });
  }
};
