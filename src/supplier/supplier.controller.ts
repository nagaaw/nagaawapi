import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Supplier } from '../core/entities/supplier.entity';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}
    
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('searchQuery') searchQuery?: string,
      @Query('sort') sort?: string,
    ): Promise<{ data: Supplier[]; total: number }> {
      const sortParams = sort ? JSON.parse(sort) : [];
      return this.supplierService.findAll(page, limit, searchQuery, sortParams);
    }
    
      @Get(':id')
      findOne(@Param('id') id: number): Promise<Supplier | null> {
        return this.supplierService.findOne(id);
      }
    
      @Post()
      create(@Body() Supplier: Supplier): Promise<Supplier> {
        return this.supplierService.create(Supplier);
      }
    
      @Put(':id')
      update(@Param('id') id: number, @Body() Supplier: Supplier): Promise<Supplier> {
        return this.supplierService.update(id, Supplier);
      }
    
      @Delete(':id')
      remove(@Param('id') id: number): Promise<void> {
        return this.supplierService.remove(id);
      }
}
