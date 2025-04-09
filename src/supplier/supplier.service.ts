import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../core/entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, searchQuery?: string, sort?: any[]): Promise<{ data: Supplier[]; total: number }> {
    const query = this.supplierRepository.createQueryBuilder('supplier');

    if (searchQuery) { 
      query.andWhere(
        `(supplier.firstName LIKE :searchQuery OR
          supplier.lastName LIKE :searchQuery OR
          supplier.phone LIKE :searchQuery OR
          supplier.city LIKE :searchQuery OR
          supplier.country LIKE :searchQuery OR
          supplier.email LIKE :searchQuery OR
          supplier.adresse LIKE :searchQuery OR
          supplier.reference LIKE :searchQuery)`,
        { searchQuery: `%${searchQuery}%` }
      );
    }

    if (sort && sort.length) {
      sort.forEach((st: any) => {
        query.addOrderBy(`supplier.${st.key}`, st.value);
      });
    } else {
      query.orderBy('supplier.createdAt', 'DESC');
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();

    return { data, total };
  }

  findOne(id: number): Promise<Supplier | null> {
    return this.supplierRepository.findOneBy({ id });
  }

  create(supplier: Supplier): Promise<Supplier> {
    return this.supplierRepository.save(supplier);
  }

  update(id: number, supplier: Supplier): Promise<Supplier> {
    return this.supplierRepository.save({ ...supplier, id });
  }

  remove(id: number): Promise<void> {
    return this.supplierRepository.delete(id).then(() => undefined);
  }
}
