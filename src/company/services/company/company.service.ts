import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Company } from '../../../core/entities/company.entity';
import { User } from '../../../core/entities/user.entity';
import { CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto } from '../../dtos/company.dto';
import { CompanyMapper } from '../../dtos/company.mapper';
import { OpenAIService } from '../../../core/services/openai/openai.service';
import { generateBusinessModelPrompt } from '../../../core/services/openai/openai_prompt_generator';
import { BusinessModel } from '../../../core/entities/businessmodel.entity';
import { Stock } from '../../../core/entities/stock.entity';

@Injectable()
export class CompanyService {
  
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessModel)
    private readonly businessModelRepository: Repository<BusinessModel>,
    private readonly openaiService: OpenAIService
  ) {}


  /**
   * Create a new company with the current user as owner.
   */
  async createCompany(user: User , company: CreateCompanyDto, manager: EntityManager):
   Promise<Company> {
   // const user = await this.userRepository.findOne({ where: { id: user.id }, relations: ['company'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.companies) {
      throw new ForbiddenException('User already owns a company');
    }

    const newCompany = manager.create(Company,{
      name: company.name,
      sector: company.sector,
      owner: user,
    });

 
    const createdCompany: Company = await manager.save(Company,newCompany);

    const {id,name, description, sector} = createdCompany;
    // const prompt: string = generateBusinessModelPrompt(name,description,sector);
   
    // const response = await this.openaiService.generateTextModelGPT4OMini(prompt);
    // const cleanedResponse = response.replace(/`/g, '').trim();
    
    try{
      // const jsonResponse: BusinessModel = JSON.parse(cleanedResponse);
      // console.log(jsonResponse.channels)
    //  const model =  await this.businessModelRepository.save({
    //   channels: jsonResponse.channels,
    //   valueProposition: jsonResponse.valueProposition,
    //   customerSegments: jsonResponse.customerSegments,
    //   customerRelationships: jsonResponse.customerRelationships,
    //   revenueStreams: jsonResponse.revenueStreams,
    //   keyResources: jsonResponse.keyResources,
    //   keyActivities: jsonResponse.keyActivities,
    //   keyPartnerships: jsonResponse.keyPartnerships,
    //   costStructure: jsonResponse.costStructure,
    //   projectId: id
    // })
    // Logger.log(`Model ${model.id} généré avec succès!`)
    }catch(error){
     console.log('parse error', error)
    }
 
  
    return  createdCompany
  }

  /**
   * Get company details of the current user.
   */
  async getUserCompany(userId: number): Promise<Company[]> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['company'] });

    if (!user || !user.companies) {
      throw new NotFoundException('Company not found');
    }

    return user.companies;
  }

  async getUserCompanyById(companyId: any, manager?: EntityManager ): Promise<Company | null> {
    if(manager){
      return await manager.findOne(Company, {where:{id: companyId}})
    }
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company!;
  }
  /**
   * Update company details.
   */
  async updateCompany(userId: number, company: UpdateCompanyDto): Promise<Company> {
    const user = await this.companyRepository.findOne({ where: { id: company.id, owner: {id: userId} } });

    if (!company) {
      throw new NotFoundException('Company not found');
    }


    return this.companyRepository.save(company);
  }

  /**
   * Delete the current user's company.
   */
  async deleteCompany(companyId: number, userId: number): Promise<{ message: string }> {
    const company = await this.companyRepository.findOne({ where: { id: companyId, owner: {id: userId} } });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.companyRepository.remove(company);
   
    return { message: 'Company deleted successfully' };
  }

 
}
