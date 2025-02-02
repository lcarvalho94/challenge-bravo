import { Request, Response } from 'express';
import Joi from 'joi';
import { ICurrencyService } from '../services/currency.service';
import { HttpStatus } from '../web/http-status';

const inputAddCurrencySchema = Joi.object({
  code: Joi.string().min(3).max(5).uppercase().required(),
  exchangeRate: Joi.string()
    .regex(new RegExp('^(?=.+)(?:[1-9]\\d*|0)?(?:\\.\\d+)?$'))
    .error(new Error("You must use '.' as delimiter and the number must be positive.")),
});

const inputDeleteCurrencySchema = Joi.string().min(3).max(5).uppercase().required();

const inputGetCurrenciesSchema = Joi.string().valid('real', 'fictitious', 'REAL', 'FICTITIOUS');

const inputExchangeCurrencySchema = Joi.object({
  from: Joi.string().min(3).max(5).uppercase().required(),
  to: Joi.string().min(3).max(5).uppercase().required(),
  amount: Joi.string().regex(new RegExp('^(?=.+)(?:[1-9]\\d*|0)?(?:\\.\\d+)?$')).required(),
});

export class CurrencyController {
  protected serviceResponseMap: Map<string, HttpStatus>;

  constructor(private readonly currencyService: ICurrencyService) {}

  public async addCurrency(req: Request, res: Response) {
    const { body } = req;

    try {
      await inputAddCurrencySchema.validateAsync(body);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ data: null, error: error.message });
      return;
    }

    try {
      const result = await this.currencyService.addCurrency(body);
      res.status(HttpStatus.OK).json({ data: result, error: null });
    } catch (error) {
      console.log(error);
      const httpStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(httpStatus).send({ data: null, error: error.message });
    }
  }

  public async deleteCurrency(req: Request, res: Response) {
    const { currency } = req.query;

    try {
      await inputDeleteCurrencySchema.validateAsync(currency);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ data: null, error: error.message });
      return;
    }

    try {
      const result = await this.currencyService.deleteCurrency(currency);
      res.status(HttpStatus.OK).json({ data: result, error: null });
    } catch (error) {
      console.log(error);
      const httpStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(httpStatus).send({ data: null, error: error.message });
    }
  }

  public async getCurrencies(req: Request, res: Response) {
    const type = req.query.type as string;

    try {
      await inputGetCurrenciesSchema.validateAsync(type);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ data: null, error: error.message });
      return;
    }

    try {
      const result = await this.currencyService.getCurrencies(type);
      res.status(HttpStatus.OK).json({ data: result, error: null });
    } catch (error) {
      console.log(error);
      const httpStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(httpStatus).send({ data: null, error: error.message });
    }
  }

  public async exchangeCurrency(req: Request, res: Response) {
    const exchangeInput = req.query;

    try {
      await inputExchangeCurrencySchema.validateAsync(exchangeInput);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ data: null, error: error.message });
      return;
    }

    try {
      const from = exchangeInput.from as string;
      const to = exchangeInput.to as string;
      const amount = exchangeInput.amount as string;
      const result = await this.currencyService.exchangeCurrencies(from, to, amount);
      res.status(HttpStatus.OK).json({ data: result, error: null });
    } catch (error) {
      console.log(error);
      const httpStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(httpStatus).send({ data: null, error: error.message });
    }
  }
}
