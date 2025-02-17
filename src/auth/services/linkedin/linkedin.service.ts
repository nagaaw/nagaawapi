import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LinkedinService {
    private readonly apiUrl = 'https://api.linkedin.com/v2';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Vérifie si l'utilisateur possède déjà une page entreprise.
   */
  async getUserOrganizations(accessToken: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/organizationalEntityAcls?q=roleAssignee`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data.elements;
    } catch (error) {
      throw new UnauthorizedException('Erreur lors de la récupération des pages');
    }
  }

  /**
   * Crée une nouvelle page entreprise sur LinkedIn.
   */
  async createCompanyPage(accessToken: string, companyData: any) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/organizations`,
        {
          localizedName: companyData.name,
          vanityName: companyData.vanityName, // Nom unique de l'entreprise
          description: companyData.description,
          locations: [
            {
              country: companyData.country,
              postalCode: companyData.postalCode,
              city: companyData.city,
            },
          ],
          logoV2: { original: companyData.logoUrl },
          website: companyData.website,
          organizationType: 'COMPANY',
          industries: companyData.industries, // Ex: ['TECHNOLOGY_SOFTWARE']
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Erreur lors de la création de la page entreprise');
    }
  }
}
