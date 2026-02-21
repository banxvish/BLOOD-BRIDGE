// src/routes/donors.ts
import express from 'express';
import { registerDonor, getDonors, updateDonor, deleteDonor } from '../controllers/donorController';

const router = express.Router();

router.post('/', registerDonor);
router.get('/', getDonors);
router.patch('/:id', updateDonor);
router.delete('/:id', deleteDonor);

export default router;
