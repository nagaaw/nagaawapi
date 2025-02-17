import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { StockService } from '../../services/stock/stock.service';
import { CreateStockDto } from '../../../core/dtos/stock.dto';
import { CreateStockProductDto } from '../../dtos/stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * Increment stock for a product.
   * @param productId The ID of the product.
   * @param stockId The ID of the stock.
   * @param quantity The quantity to add.
   * @returns The updated stock-product relationship.
   */
  @Post('increment')
  async incrementStock(@Body() stockProduct: CreateStockProductDto) {
    try {
      return await this.stockService.incrementStock(stockProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * Decrement stock for a product.
   * @param productId The ID of the product.
   * @param stockId The ID of the stock.
   * @param quantity The quantity to subtract.
   * @returns The updated stock-product relationship.
   */
  @Post('decrement')
  async decrementStock(@Body() stockProduct: CreateStockProductDto) {
    try {
      return await this.stockService.decrementStock(stockProduct);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Failed to decrement stock.');
    }
  }

  /**
   * Get all stocks with their associated products.
   * @returns A list of all stocks.
   */
  @Get()
  async getAllStocks() {
    return this.stockService.getAllStocks();
  }

  /**
   * Delete a stock by ID.
   * @param stockId The ID of the stock to delete.
   * @throws NotFoundException if the stock is not found.
   */
  @Delete(':stockId')
  async deleteStock(@Param('stockId') stockId: number) {
    try {
      await this.stockService.deleteStock(stockId);
      return { message: `Stock with ID ${stockId} deleted successfully.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * Create a new stock.
   * @param stockDto The data to create the stock.
   * @returns The created stock.
   */
  @Post()
  async createStock(@Body() stockDto: CreateStockDto) {
    try {
      return await this.stockService.createStock(stockDto);
    } catch (error) {
      throw new ConflictException('Failed to create stock.');
    }
  }
}