import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({ 
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Make the file publicly accessible
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; // Return the file URL
  } 

  async deleteFile(fileKey: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: fileKey,
    };

    await this.s3.deleteObject(params).promise();
  }
}
