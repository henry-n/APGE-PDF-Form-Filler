import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { fileURLToPath } from "node:url";
import { scheduleA, scheduleB } from "./apgeFieldMap.js";
import { clean, formatContractPrice, formatDateForPdf } from "./formatPdfValues.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const templatePath = path.join(projectRoot, "templates", "APGE Template Full.pdf");

function getPage(pdfDoc, field) {
  return pdfDoc.getPages()[field.page];
}

function drawText(pdfDoc, font, field, value) {
  const text = clean(value);
  if (!text) return;

  const page = getPage(pdfDoc, field);
  const size = field.size ?? 9;
  const maxWidth = field.maxWidth;

  if (!maxWidth) {
    page.drawText(text, {
      x: field.x,
      y: field.y,
      size,
      font,
      color: rgb(0, 0, 0)
    });
    return;
  }

  const lines = wrapText(text, font, size, maxWidth, 2);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: field.x,
      y: field.y - index * (size + 2),
      size,
      font,
      color: rgb(0, 0, 0)
    });
  });
}

function drawCheck(pdfDoc, font, field, shouldCheck) {
  if (!shouldCheck) return;

  const page = getPage(pdfDoc, field);
  page.drawText("X", {
    x: field.x,
    y: field.y,
    size: field.size ?? 10,
    font,
    color: rgb(0, 0, 0)
  });
}

function drawRowText(page, font, column, y, value) {
  const text = clean(value);
  if (!text) return;

  const lines = wrapText(text, font, column.size ?? 7, column.maxWidth ?? 100, 3);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: column.x,
      y: y - index * ((column.size ?? 7) + 2),
      size: column.size ?? 7,
      font,
      color: rgb(0, 0, 0)
    });
  });
}

function drawRowCheck(page, font, column, y, shouldCheck) {
  if (!shouldCheck) return;

  page.drawText("X", {
    x: column.x,
    y,
    size: column.size ?? 10,
    font,
    color: rgb(0, 0, 0)
  });
}

function wrapText(text, font, size, maxWidth, maxLines = 2) {
  const words = clean(text).split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);

    if (width <= maxWidth) {
      currentLine = testLine;
      continue;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;

    if (lines.length === maxLines - 1) break;
  }

  if (currentLine && lines.length < maxLines) lines.push(currentLine);

  if (lines.length === maxLines) {
    const lastIndex = lines.length - 1;
    const originalLast = lines[lastIndex];
    let shortened = originalLast;

    while (font.widthOfTextAtSize(`${shortened}...`, size) > maxWidth && shortened.length > 3) {
      shortened = shortened.slice(0, -1);
    }

    if (shortened !== originalLast) lines[lastIndex] = `${shortened}...`;
  }

  return lines;
}

export async function fillApgePdf(formData) {
  const templateBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const type = formData.customerType;

  if (type === "residential") {
    drawText(pdfDoc, font, scheduleA.residential.customerName, formData.residential?.customerName);
    drawText(pdfDoc, font, scheduleA.residential.email, formData.residential?.email);
    drawText(pdfDoc, font, scheduleA.residential.dateOfBirth, formatDateForPdf(formData.residential?.dateOfBirth));
    drawText(pdfDoc, font, scheduleA.residential.ssnLast4, formData.residential?.ssnLast4);
    drawText(pdfDoc, font, scheduleA.residential.phone, formData.residential?.phone);
    drawText(pdfDoc, font, scheduleA.residential.mailingAddress, formData.residential?.mailingAddress);
  }

  if (type === "commercial") {
    drawText(pdfDoc, font, scheduleA.commercial.companyLegalName, formData.commercial?.companyLegalName);
    drawText(pdfDoc, font, scheduleA.commercial.dba, formData.commercial?.dba);
    drawText(pdfDoc, font, scheduleA.commercial.contactName, formData.commercial?.contactName);
    drawText(pdfDoc, font, scheduleA.commercial.contactEmail, formData.commercial?.contactEmail);
    drawText(pdfDoc, font, scheduleA.commercial.companyAddress, formData.commercial?.companyAddress);
    drawText(pdfDoc, font, scheduleA.commercial.phone, formData.commercial?.phone);
    drawText(pdfDoc, font, scheduleA.commercial.fax, formData.commercial?.fax);
  }

  drawText(pdfDoc, font, scheduleA.billing.attentionTo, formData.billing?.attentionTo);
  drawText(pdfDoc, font, scheduleA.billing.email, formData.billing?.email);
  drawText(pdfDoc, font, scheduleA.billing.phone, formData.billing?.phone);
  drawText(pdfDoc, font, scheduleA.billing.federalTaxId, formData.billing?.federalTaxId);

  drawCheck(pdfDoc, font, scheduleA.billing.invoiceTypeIndividual, formData.billing?.invoiceType === "individual");
  drawCheck(pdfDoc, font, scheduleA.billing.invoiceTypeSummary, formData.billing?.invoiceType === "summary");
  drawCheck(pdfDoc, font, scheduleA.billing.deliveryEmail, formData.billing?.deliveryPreference === "email");
  drawCheck(pdfDoc, font, scheduleA.billing.deliveryUsps, formData.billing?.deliveryPreference === "usps");
  drawCheck(pdfDoc, font, scheduleA.billing.deliveryBoth, formData.billing?.deliveryPreference === "both");
  drawCheck(pdfDoc, font, scheduleA.billing.paymentAch, formData.billing?.paymentMethod === "ach");
  drawCheck(pdfDoc, font, scheduleA.billing.paymentCheck, formData.billing?.paymentMethod === "check");
  drawCheck(pdfDoc, font, scheduleA.billing.languageEnglish, formData.billing?.language === "english");
  drawCheck(pdfDoc, font, scheduleA.billing.languageSpanish, formData.billing?.language === "spanish");

  drawText(pdfDoc, font, scheduleA.authorizedRep.name1, formData.authorizedRep?.name1);
  drawText(pdfDoc, font, scheduleA.authorizedRep.title1, formData.authorizedRep?.title1);
  drawText(pdfDoc, font, scheduleA.authorizedRep.phone1, formData.authorizedRep?.phone1);
  drawText(pdfDoc, font, scheduleA.authorizedRep.email1, formData.authorizedRep?.email1);

  drawText(pdfDoc, font, scheduleA.product.contractPrice, formatContractPrice(formData.product?.contractPrice));
  drawText(pdfDoc, font, scheduleA.product.contractTermMonths, formData.product?.contractTermMonths);

  drawText(pdfDoc, font, scheduleA.signature.printedName, formData.signature?.printedName);
  drawText(pdfDoc, font, scheduleA.signature.title, formData.signature?.title);
  drawText(pdfDoc, font, scheduleA.signature.date, formatDateForPdf(formData.signature?.date));
  drawText(pdfDoc, font, scheduleA.signature.referenceId, formData.signature?.referenceId);

  const pageB = pdfDoc.getPages()[1];
  const locations = Array.isArray(formData.serviceLocations) ? formData.serviceLocations : [];
  const rows = locations.slice(0, scheduleB.maxRows);

  rows.forEach((location, index) => {
    const y = scheduleB.firstRowY - index * scheduleB.rowHeight;
    const cols = scheduleB.columns;

    drawRowText(pageB, font, cols.esiId, y, location.esiId);
    drawRowCheck(pageB, font, cols.resiCheck, y, location.usedFor === "resi");
    drawRowCheck(pageB, font, cols.commCheck, y, location.usedFor === "comm");
    drawRowText(pageB, font, cols.serviceAddress, y, location.serviceAddress);
    drawRowText(pageB, font, cols.billingAddress, y, location.billingAddress);
    drawRowText(pageB, font, cols.estimatedStartDate, y, formatDateForPdf(location.estimatedStartDate));
    drawRowCheck(pageB, font, cols.taxExemptCheck, y, Boolean(location.taxExempt));
    drawRowCheck(pageB, font, cols.moveInCheck, y, location.enrollmentType === "move-in");
    drawRowCheck(pageB, font, cols.switchCheck, y, location.enrollmentType === "switch");
    drawRowText(pageB, font, cols.estimatedAnnualKwh, y, location.estimatedAnnualKwh);
  });

  drawText(pdfDoc, font, scheduleB.totalAccounts, String(rows.length));

  return await pdfDoc.save();
}