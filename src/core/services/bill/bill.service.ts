import * as PDFDocument from 'pdfkit';
import { Order } from '../../entities/order.entity';
import { Injectable, Logger } from '@nestjs/common';
import * as blobStream from 'blob-stream';
import { OrderItem } from '../../entities/orderitem.entity';

const COLORS = {
  PRIMARY: '#1F4E79',
  BLACK: 'black',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F4F4F4',
};

const MARGIN = 50;
const FONT_SIZE = {
  HEADER: 28,
  SECTION: 11,
  TEXT: 10,
  TABLE_HEADER: 11,
  TABLE_BODY: 10,
  FOOTER: 10,
};


@Injectable()
export class BillService{
 

 generateBill(order: Order): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: MARGIN });
    const stream = doc.pipe(blobStream());

    try {
      let currentY = MARGIN + 60; // Dynamic Y-position tracker

      this.addHeader(doc, currentY); // Title of the invoice
      currentY = this.addSection(doc, 'Fournisseur', currentY, [
        'Mon Entreprise',
        '22, Avenue Voltaire',
        '13000 Marseille',
      ]);
      currentY = this.addSection(doc, 'Client', currentY, [
        `${order.supplier.firstName} ${order.supplier.lastName}`,
        order.supplier.adresse,
        order.supplier.city,
      ]);

      currentY =this.addInvoiceInfo(doc, order, currentY);
      currentY = this.addItemsTable(doc, order.items, currentY);
      currentY = this.addTotals(doc, order, currentY);
      this.addFooter(doc, currentY);

      doc.end();

      stream.on('finish', () => {
        const blob = stream.toBlob('application/pdf');
        blob.arrayBuffer().then((buffer) => {
          resolve(Buffer.from(buffer));
        }).catch(reject);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

addHeader(doc: PDFKit.PDFDocument, y: number) {
  doc.fillColor(COLORS.PRIMARY)
    .fontSize(FONT_SIZE.HEADER)
    .text('Facture', MARGIN, y);
  doc.moveDown(1);
}

addSection(doc: PDFKit.PDFDocument, title: string, y: number, lines: string[]) {
  doc.fillColor(COLORS.BLACK).fontSize(FONT_SIZE.SECTION).text(title, MARGIN, y);
  lines.forEach((line, index) => {
    doc.fontSize(FONT_SIZE.TEXT).text(line, MARGIN, y + 20 + index * 15);
  });
  return y + 20 + lines.length * 15 + 10;
}

addInvoiceInfo(doc: PDFKit.PDFDocument, order: Order, y: number) {
  doc.fontSize(FONT_SIZE.SECTION).text(`Date de facturation: ${order.createdAt.toLocaleDateString()}`, MARGIN, y);
  doc.fontSize(FONT_SIZE.SECTION).text(`Numéro de facture: ${order.reference}`, 250, y);
  doc.fontSize(FONT_SIZE.SECTION).text('Échéance:', MARGIN, y + 25);
  doc.fontSize(FONT_SIZE.TEXT).text('N/A', MARGIN + 100, y + 25);
  doc.fontSize(FONT_SIZE.SECTION).text('Paiement:', 250, y + 25);
  doc.fontSize(FONT_SIZE.TEXT).text('30 jours', 250 + 100, y + 25);
  return y + 65;
}

addItemsTable(doc: PDFKit.PDFDocument, items: OrderItem[], y: number) {
  doc.fillColor(COLORS.PRIMARY).rect(MARGIN, y, 500, 20).fill();
  doc.fillColor(COLORS.WHITE).fontSize(FONT_SIZE.TABLE_HEADER).text('Désignation', MARGIN + 5, y + 5);
  doc.text('Quantité', 200, y + 5);
  doc.text('Unité', 270, y + 5);
  doc.text('Prix Unitaire', 340, y + 5);
  doc.text('Total', 450, y + 5);
  doc.fillColor(COLORS.BLACK);
  y += 22;

  items.forEach((item) => {
    doc.fontSize(FONT_SIZE.TABLE_BODY).text(item.product.name, MARGIN + 5, y);
    doc.text(item.quantity.toString(), 200, y);
    doc.text(item.unit, 270, y);
    doc.text(`${item.price} FCFA`, 340, y);
    doc.text(`${item.total} FCFA`, 450, y);
    doc.moveTo(MARGIN, y + 15).lineTo(550, y + 15).stroke();
    y += 22;
  });
  return y;
}

 addTotals(doc: PDFKit.PDFDocument, order: Order, y: number) {
  const totalHeight = 18;
  const totalSpacing = 20;
  
  doc.fontSize(FONT_SIZE.SECTION).fillColor(COLORS.PRIMARY).text('Total HT', 370, y);
  doc.fillColor(COLORS.BLACK).text(`${order.totalAmount} FCFA`, 450, y);
  y += totalSpacing;

  doc.fillColor(COLORS.PRIMARY).text('Total TVA', 370, y);
  doc.fillColor(COLORS.BLACK).text('0 FCFA', 450, y);
  y += totalSpacing;

  doc.fillColor(COLORS.PRIMARY).text('Total TTC', 370, y);
  doc.fillColor(COLORS.BLACK).text(`${order.totalAmount} FCFA`, 450, y);
  return y + totalHeight + 10;
}

addFooter(doc: PDFKit.PDFDocument, y: number) {
  doc.fontSize(FONT_SIZE.FOOTER).text('Merci pour votre confiance.', MARGIN, y + 30, { align: 'center' });
}

  
  
}