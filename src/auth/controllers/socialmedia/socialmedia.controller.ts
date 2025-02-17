import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { LinkedinService } from '../../services/linkedin/linkedin.service';

@Controller('socialmedia')
export class SocialmediaController {
    constructor(private readonly linkedinService: LinkedinService) {}

  @Post('linkedin')
  async createCompanyPage(
    @Headers('Authorization') authHeader: string,
    @Body() companyData: any,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access Token manquant');
    }
    const accessToken = authHeader.split(' ')[1];

    // Vérifier si l'utilisateur a déjà une page
    const existingPages = await this.linkedinService.getUserOrganizations(accessToken);
    if (existingPages.length > 0) {
      return { message: 'L’utilisateur possède déjà une page entreprise.', existingPages };
    }

    // Créer une nouvelle page
    return this.linkedinService.createCompanyPage(accessToken, companyData);
  }
}
