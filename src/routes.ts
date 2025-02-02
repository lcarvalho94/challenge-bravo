import express from 'express';
import { currencyController } from './controllers';

const router = express.Router();

router.get('/currencies', (req, res) => currencyController.getCurrencies(req, res));
router.post('/currencies', (req, res) => currencyController.addCurrency(req, res));
router.delete('/currencies', (req, res) => currencyController.deleteCurrency(req, res));

router.get('/exchange', (req, res) => currencyController.exchangeCurrency(req, res));

export default router;
