import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { postPalette, getHarmonies } from '../controllers/palette.controller';

const router = Router();

router.post('/palette', upload.single('image'), postPalette);
router.get('/harmonies/:hex', getHarmonies);

export default router;
