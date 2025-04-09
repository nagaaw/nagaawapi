import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Order } from '../entities/order.entity';
import { S3Service } from '../../upload/services/S3Service.service';


@Injectable()
export class PdfMakerService {

   constructor(private readonly s3Service: S3Service){

   }
  async generateOrderBill(order: Order): Promise<String> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(20).text('Order Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Reference: ${order.reference}`);
    doc.fontSize(14).text(`Date: ${order.createdAt.toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(12).text('Items:');
    order.items.forEach(item => {
      doc.fontSize(12).text(`- ${item.product.name} x ${item.quantity} : $${item.price}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${this.calculateTotal(order)}`);

    doc.end();
    const pdfBuffer = Buffer.concat(buffers);
    const filePath = `bills/${order.reference}.pdf`;

   const location = await this.s3Service.uploadFilePDF(filePath, pdfBuffer);

    return location;
  }

  private calculateTotal(order: Order): number {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
