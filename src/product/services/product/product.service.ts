import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from '../../../core/entities/product.entity';
import { OpenAIService } from '../../../core/services/openai/openai.service';
import { generateSqlScriptPrompt } from '../../../core/services/openai/openai_prompt_generator';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/product.dto';
import { Stock } from '../../../core/entities/stock.entity';
import { Supplier } from '../../../core/entities/supplier.entity';
import { StockProduct } from '../../../core/entities/stock_product.entity';
import { generateReference } from '../../../core/uttils/generate-reference';
import { SalesPackaging } from '../../../core/entities/sales_packaging.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly openAIService: OpenAIService,
    private readonly dataSource: DataSource,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(StockProduct)
    private readonly stockProductRepository: Repository<StockProduct>,
    @InjectRepository(SalesPackaging)
    private readonly salePackagingRepository: Repository<SalesPackaging>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    active?: boolean,
    reference?: 'ASC' | 'DESC',
    codeBarre?: 'ASC' | 'DESC',
    name?: 'ASC' | 'DESC',
    storageUnit?: string[],
    keyword?: string
  ): Promise<{ data: Product[]; total: number }> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.salesPackagings', 'salesPackagings')
      .leftJoinAndSelect('product.suppliers', 'suppliers')
      .skip((page - 1) * limit)
      .take(limit)
      .where('product.active = 1')
      .orderBy('product.createdAt', 'DESC');
      

    if (keyword) {
      queryBuilder.andWhere(
        `(product.name LIKE :keyword OR product.reference LIKE :keyword OR product.codeBarre LIKE :keyword)`,
        { keyword: `%${keyword}%` }
      );
    }

    if (active !== undefined) {
      queryBuilder.andWhere(`product.active = ${active}`);
    }

    if (reference) {
      queryBuilder.orderBy('product.reference', reference);
    }

    if (codeBarre) {
      queryBuilder.orderBy('product.codeBarre', codeBarre);
    }

    if (storageUnit && storageUnit.length) {
      storageUnit.forEach((su: any) => {
        queryBuilder.andWhere(`product.${su.key}=${su.value}`)
      })
    }

    if (name) {
      queryBuilder.orderBy('product.name', name);
    }
   this.logger.debug(queryBuilder.getSql())
    const [data, total] = await queryBuilder.getManyAndCount();

    if (!data) {
      throw new NotFoundException('No products found.');
    }

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(productDTO: CreateProductDTO): Promise<Product> {
    const product = new Product();
    await this.mapProductDTO(productDTO, product);
    const savedProduct = await this.productsRepository.save(product);

    const stock = await this.stockRepository.findOne({ where: { id: productDTO.stockId } });
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    const stockProduct = new StockProduct();
    stockProduct.product = savedProduct;
    stockProduct.stock = stock;
    stockProduct.quantity = 0;
    stockProduct.unit = productDTO.storageUnit;
    await this.stockProductRepository.save(stockProduct);

    const salesPackagings = product.salesPackagings.map(spData => {
      const salesPackaging = new SalesPackaging();
      salesPackaging.unit = spData.unit;
      salesPackaging.quantity = spData.quantity;
      salesPackaging.purchasePrice = spData.purchasePrice;
      salesPackaging.sellPrice = spData.sellPrice;
      salesPackaging.product = savedProduct;
      return salesPackaging;
    });

    await this.salePackagingRepository.save(salesPackagings);

    return savedProduct;
  }

  async update(id: number, productDTO: UpdateProductDTO): Promise<Product> {
    const product = await this.findOne(id);
    await this.mapProductDTO(productDTO, product);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Product not found');
    }
  }

  async createFromPrompt(prompt: string): Promise<any> {
    const cleanedPrompt = generateSqlScriptPrompt(prompt);
    const sqlScript = await this.openAIService.generateTextModelGPT4OMini(cleanedPrompt);
    const cleanedSqlScript = sqlScript.replace(/sql/g, '').replace(/`/g, '').trim();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(cleanedSqlScript);
      await queryRunner.commitTransaction();
      return { message: 'Products inserted successfully.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error executing SQL script:', error.message);
      throw new Error('Error executing SQL script: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private async mapProductDTO(productDTO: CreateProductDTO | UpdateProductDTO, product: Product): Promise<void> {
    if (productDTO.suppliers && productDTO.suppliers.length > 0) {
      product.suppliers = await this.supplierRepository.find({ where: { id: In(productDTO.suppliers) } });
    }

    product.imgUrls = productDTO.imgUrls ?? ['assets/img-placeholder.jpg'];
    product.codeBarre = productDTO.codeBarre ?? product.codeBarre;
    product.criticalStorage = productDTO.criticalStorage ?? product.criticalStorage;
    product.name = productDTO.name ?? product.name;
    product.storable = productDTO.storable ?? product.storable;
    product.cump = productDTO.cump ?? product.cump;
    product.storageUnit = productDTO.storageUnit ?? product.storageUnit;
    product.salesPackagings = productDTO.salesPackaging ?? product.salesPackagings;
    product.reference = generateReference('PROD') ?? product.reference;
    product.codeBarre = generateReference('');
  }
}
