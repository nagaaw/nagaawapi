import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
import { CategoryService } from '../../../core/services/category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos/category.dto';
  
  @Controller('categories')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoryService.create(createCategoryDto);
    }
  
    @Get()
    async findAll() {
      return this.categoryService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number) {
      return this.categoryService.findOne(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
      return this.categoryService.update(id, updateCategoryDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number) {
      return this.categoryService.remove(id);
    }
  }