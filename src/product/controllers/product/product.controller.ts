import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
import { ProductsService } from '../../services/product/product.service';
import { Product } from '../../../core/entities/product.entity';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/product.dto';
import { UpdateCategoryDto } from '../../dtos/category.dto';
 
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<{ data: Product[]; total: number }> {
      return this.productsService.findAll(page, limit);
    }
  
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Product | null> {
      return this.productsService.findOne(id);
    }
  
    @Post()
    create(@Body() product: Product): Promise<Product> {
      return this.productsService.create(product);
    }
  
    @Put(':id')
    update(@Param('id') id: number, @Body() product: UpdateProductDTO): Promise<Product | null> {

      return this.productsService.update(id, product);
    }
  
    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
      return this.productsService.remove(id);
    }

    @Post('bot')
    createWithBot(@Body() prompt: {message: string}): Promise<Product> {
      return this.productsService.createFromPrompt(prompt.message)
    }
  }