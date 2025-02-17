import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../../../core/entities/product.entity';
import { OpenAIService } from '../../../core/services/openai/openai.service';
import { generateSqlScriptPrompt } from '../../../core/services/openai/openai_prompt_generator';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/product.dto';
import { Stock } from '../../../core/entities/stock.entity';
import { CategoryService } from '../../../core/services/category/category.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly openAIService: OpenAIService,
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoryService
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit; // Calculate the offset

    const [data, total] = await this.productsRepository.findAndCount({
      skip,
      take: limit,
    });

    if (!data.length) {
      throw new NotFoundException('No products found.');
    }

    return { data, total };
  }

  // Other methods (findOne, create, update, remove, createFromPrompt) remain unchanged
  findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(productDTO: CreateProductDTO): Promise<Product> {
    const product: Product = new Product()
   try{
   if(productDTO.category){
    const  category = await  this.categoryService.findOne(productDTO.category!)
    if(category){
      if(product.categories){
        product.categories.push(category)
      }else{
        product.categories = [category]
      }
    }
   }
   
    product.description = productDTO.description??'-';
    product.label = productDTO.label;
    product.price =  productDTO.price;
    product.imgUrls = productDTO.imgUrls??['assets/img-placeholder.jpg']
  
    return this.productsRepository.save(product);

  }catch(error) {
    console.debug(error)
  }
   return new Product();
  }

  async update(id: number, productDTO: UpdateProductDTO): Promise<Product | null> {
    const product = await this.productsRepository.findOne({where: {id: productDTO.id}});
   if(!product){
    throw new NotFoundException('Product not found')
   }
   
    if(productDTO.category){
      const  category = await  this.categoryService.findOne(productDTO.category!)
      if(category){
        if(product.categories){
          product.categories.push(category)
        }else{
          product.categories = [category]
        }
      }
     }
     product.label = productDTO.label!;
     product.description = productDTO.description!
     product.imgUrls = product.imgUrls!
     product.price = product.price!
    await this.productsRepository.update(id, product);
    return this.productsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async createFromPrompt(prompt: string): Promise<any> {
    console.log(prompt)
    const cleanedPrompt: string =  generateSqlScriptPrompt(prompt)
  console.log(cleanedPrompt)
    const sqlScript = await this.openAIService.generateTextModelGPT4OMini(cleanedPrompt);
    let cleanedSqlScript = sqlScript.replace(/sql/g, '').trim();
    cleanedSqlScript = cleanedSqlScript.replace(/`/g, '').trim();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(cleanedSqlScript);
      await queryRunner.commitTransaction();
      return { message: 'Produits insérés avec succès.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Erreur lors de l\'exécution du script SQL : ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}