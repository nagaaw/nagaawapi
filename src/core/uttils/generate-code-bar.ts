import * as bwipjs from 'bwip-js';

// Function to generate a barcode
async function generateBarcode(data: string, type: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: type,       // Barcode type, e.g., 'code128', 'ean-13'
      text: data,       // Data to encode in the barcode
      scale: 3,         // Scaling factor
      height: 10,       // Height of the barcode
      includetext: true, // Include human-readable text
      textxalign: 'center', // Text alignment
    }, (err, png) => {
      if (err) {
        reject(err);
      } else {
        resolve(png);
      }
    });
  });
}

