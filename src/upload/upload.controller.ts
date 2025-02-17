import { Body, Controller, Delete, NotFoundException, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './services/S3Service.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundError } from 'rxjs';

@Controller('upload')
export class UploadController {
    constructor(private readonly s3Service: S3Service) {}


    @Post()
    @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form-data
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      const fileUrl = await this.s3Service.uploadFile(file);
      return { url: fileUrl };
    }

    @Delete()
    async deleteFile(@Query('name') fileKey: string) {
        try{
            await this.s3Service.deleteFile(fileKey);

        } catch(err){
            console.log(err)
           throw new NotFoundException(err?.massage|| 'Unknown error')
        }
        return { message: 'File deleted successfully' };
    }
}
