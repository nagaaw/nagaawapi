import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  
  @Injectable()
  export class FileValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      if (!value) {
        throw new BadRequestException('File is required');
      }
      if (value.size > 1024 * 1024 * 5) {
        throw new BadRequestException('File size must be less than 5MB');
      }
      if (!value.mimetype.startsWith('image/')) {
        throw new BadRequestException('File must be an image');
      }
      return value;
    }
  }