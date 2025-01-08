import { Router } from 'express';
import { generateOgImageCTRL } from '../controllers';

const router = Router();

router.post('/generate', generateOgImageCTRL);

export default router;
