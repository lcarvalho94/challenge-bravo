import { Request, Response } from 'express';
import { CurrencyService } from '../services/currency.service';

export class CurrencyController {
  private currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this.currencyService = currencyService;
  }

  public async addRealCurrency(req: Request, res: Response) {
    // add validations
    const { currency } = req.query;
    try {
      const result = await this.currencyService.addRealCurrency(currency);
      res.status(200).json(result);
    } catch (e) {
      // look for what http status to send here
      res.status(500).json(e);
    }
  }
}
