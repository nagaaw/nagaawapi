import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Stock } from '../../../core/entities/stock.entity';
import { Product } from '../../../core/entities/product.entity';
import { CreateStockDto } from '../../../core/dtos/stock.dto';
import { StockProduct } from '../../../core/entities/stock_product.entity';
import { CreateStockProductDto } from '../../dtos/stock.dto';
import { generateReference } from '../../../core/uttils/generate-reference';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(StockProduct)
    private stockProductRepository: Repository<StockProduct>,
  ) {}

  /**
   * Increment the stock quantity for a product.
   * @param productId The ID of the product.
   * @param stockId The ID of the stock.
   * @param quantity The quantity to add.
   * @returns The updated stock-product relationship.
   * @throws NotFoundException if the product or stock is not found.
   */
  async incrementStock(stockProduct: CreateStockProductDto): Promise<StockProduct> {
    return this.updateStockQuantity(stockProduct.productId, stockProduct.stockId, stockProduct.quantity);
  }

  /**
   * Decrement the stock quantity for a product.
   * @param productId The ID of the product.
   * @param stockId The ID of the stock.
   * @param quantity The quantity to subtract.
   * @returns The updated stock-product relationship.
   * @throws NotFoundException if the product or stock is not found.
   * @throws ConflictException if the decrement results in a negative stock.
   */
  async decrementStock(stockProduct: CreateStockProductDto): Promise<StockProduct> {
    return this.updateStockQuantity(stockProduct.productId, stockProduct.stockId, -stockProduct.quantity);
  }

  /**
   * Update the stock quantity for a product.
   * @param productId The ID of the product.
   * @param stockId The ID of the stock.
   * @param quantity The quantity to add or subtract (can be negative).
   * @returns The updated stock-product relationship.
   * @throws NotFoundException if the product or stock is not found.
   * @throws ConflictException if the decrement results in a negative stock.
   */
  private async updateStockQuantity(productId: number, stockId: number, quantity: number): Promise<StockProduct> {
   

    // Find or create the stock-product relationship
    let stockProduct = await this.stockProductRepository.findOne({
      where: { stock: { id: stockId }, product: { id: productId } },
    });

    if (!stockProduct) {
       // Find the product and stock
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const stock = await this.stockRepository.findOne({ where: { id: stockId } });
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }
      stockProduct = this.stockProductRepository.create({
        product,
        stock,
        quantity: 0, // Initialize quantity to 0
      });
    } 

    // Update the quantity
    stockProduct.quantity += quantity;

    // Ensure the stock does not go negative
    if (stockProduct.quantity < 0) {
      throw new ConflictException(`Insufficient stock for product ${productId}.`);
    }

    // Save the updated stock-product relationship
    return this.stockProductRepository.save(stockProduct);
  }

  /**
   * Get all stocks with their associated products.
   * @returns A list of all stocks.
   */
  async getAllStocks(): Promise<Stock[]> {
    return this.stockRepository.find();
  }

  /**
   * Get all stocks with their associated products.
   * @returns A list of all stocks.
   */
  async getAllStockProducts(stockId: number): Promise<StockProduct[]> {
    return  await this.stockProductRepository.find({where: {stock:{id: stockId}}, relations:['stock']});
  }

  /**
   * Create a new stock.
   * @param stock The data to create the stock.
   * @param manager Optional EntityManager for transactions.
   * @returns The created stock.
   */
  async createStock(stockD: Stock, manager?: EntityManager): Promise<Stock> {
    try {
      const stock = this.stockRepository.create(stockD);
      if (manager) {
        return await manager.save(Stock, stock);
      }
      stock.reference = generateReference('STK');
      return await this.stockRepository.save(stock);
    } catch (error) {
      this.logger.error(`Failed to create stock: ${error.message}`);
      throw new ConflictException('Failed to create stock.');
    }
  }

  /**
   * Delete a stock by ID.
   * @param stockId The ID of the stock to delete.
   * @throws NotFoundException if the stock is not found.
   */
  async deleteStock(stockId: number): Promise<void> {
    const result = await this.stockRepository.delete(stockId);
    if (result.affected === 0) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }
  }
}