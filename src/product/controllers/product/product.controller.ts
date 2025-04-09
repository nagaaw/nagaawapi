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
 
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('active') active?: boolean,
      @Query('searchKeyWord') searchKeyWord?: string,
      @Query('storageUnit') storageUnit?: string,
      @Query('reference') reference?: 'DESC' | 'ASC' | undefined,
      @Query('codeBarre') codeBarre?: 'DESC' | 'ASC' | undefined,
      @Query('name') name?: 'DESC' | 'ASC' | undefined
    ): Promise<{ data: Product[]; total: number }> {
    
      const storageUnits = storageUnit?.split('') 
      return this.productsService.findAll(page, limit,active, reference, codeBarre, name, storageUnits, searchKeyWord);
    }
  
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Product | null> {
      return this.productsService.findOne(id);
    }
  
    @Post()
    create(@Body() product: CreateProductDTO): Promise<Product> {
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