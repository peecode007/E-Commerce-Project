import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateOrderPDF(order, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(18).text(`Order Receipt #${order._id}`);
    doc.fontSize(12).text(`Date: ${order.createdAt}`);
    doc.text(`Customer: ${order.user}`);
    doc.text(`Shipping: ${JSON.stringify(order.shipping)}`);
    doc.text("Items:");
    order.items.forEach(item => {
      doc.text(`- ${item.product} x ${item.quantity} @ ${item.price}`);
    });
    doc.text(`Total: ${order.total}`);
    doc.end();
    doc.on("finish", () => resolve(filePath));
    doc.on("error", reject);
  });
}
