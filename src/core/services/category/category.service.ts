import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../product/dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto, manager?: EntityManager): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    if(manager){
      return await manager.save(Category, category);
    }
    return await this.categoryRepository.save(category);
  }

  // Find all categories
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  // Find a category by ID
  async findOneById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id }
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Update a category
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneById(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // Delete a category
  async remove(id: number): Promise<void> {
    const category = await this.findOneById(id);
    await this.categoryRepository.remove(category);
  }
}