import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const TEMPLATE_URL = new URL("./templates/APGE Template Full.pdf", import.meta.url);

export const scheduleA = {
  residential: {
    customerName: { page: 0, x: 145, y: 682, size: 8.5, maxWidth: 150 },
    email: { page: 0, x: 375, y: 682, size: 8.5, maxWidth: 180 },
    dateOfBirth: { page: 0, x: 170, y: 667, size: 8.5, maxWidth: 80 },

    // moved LEFT so the last 4 sits after "XXX-XX-" and before the Phone field
    ssnLast4: { page: 0, x: 330, y: 667, size: 8.5, maxWidth: 35 },

    phone: { page: 0, x: 450, y: 667, size: 8.5, maxWidth: 85 },
    mailingAddress: { page: 0, x: 135, y: 652, size: 8, maxWidth: 430 }
  },

  commercial: {
    companyLegalName: { page: 0, x: 190, y: 622, size: 8.5, maxWidth: 385 },
    dba: { page: 0, x: 230, y: 607, size: 8.5, maxWidth: 335 },
    contactName: { page: 0, x: 125, y: 592, size: 8.5, maxWidth: 180 },
    contactEmail: { page: 0, x: 390, y: 592, size: 8.5, maxWidth: 200 },
    companyAddress: { page: 0, x: 135, y: 577, size: 8, maxWidth: 425 },
    phone: { page: 0, x: 88, y: 562, size: 8.5, maxWidth: 210 },
    fax: { page: 0, x: 350, y: 562, size: 8.5, maxWidth: 200 }
  },

  billing: {
    attentionTo: { page: 0, x: 75, y: 532, size: 8.5, maxWidth: 220 },
    email: { page: 0, x: 385, y: 532, size: 8.5, maxWidth: 200 },
    phone: { page: 0, x: 90, y: 517, size: 8.5, maxWidth: 215 },
    federalTaxId: { page: 0, x: 445, y: 517, size: 8.5, maxWidth: 125 },

    invoiceTypeIndividual: { page: 0, x: 164, y: 501, size: 8.5 },
    invoiceTypeSummary: { page: 0, x: 233, y: 501, size: 8.5 },
    deliveryEmail: { page: 0, x: 427, y: 501, size: 8.5 },
    deliveryUsps: { page: 0, x: 475, y: 501, size: 8.5 },
    deliveryBoth: { page: 0, x: 520, y: 501, size: 8.5 },
    paymentAch: { page: 0, x: 202, y: 486, size: 8.5 },
    paymentCheck: { page: 0, x: 252, y: 486, size: 8.5 },
    languageEnglish: { page: 0, x: 398, y: 486, size: 8.5 },
    languageSpanish: { page: 0, x: 455, y: 486, size: 8.5 }
  },

  authorizedRep: {
    name1: { page: 0, x: 95, y: 457, size: 8.5, maxWidth: 205 },
    title1: { page: 0, x: 390, y: 457, size: 8.5, maxWidth: 200 },
    phone1: { page: 0, x: 95, y: 442, size: 8.5, maxWidth: 205 },
    email1: { page: 0, x: 390, y: 442, size: 8.5, maxWidth: 200 }
  },

  product: {
    productName: { page: 0, x: 160, y: 413, size: 8.5, maxWidth: 250 },
    contractPrice: { page: 0, x: 515, y: 413, size: 8.5, maxWidth: 55 },

    // moved LEFT
    contractTermMonths: { page: 0, x: 150, y: 398, size: 8.5, maxWidth: 35 }
  },

  signature: {
    printedName: { page: 0, x: 470, y: 92, size: 8.5, maxWidth: 140 },
    title: { page: 0, x: 435, y: 77, size: 8.5, maxWidth: 140 },
    date: { page: 0, x: 125, y: 61, size: 8.5, maxWidth: 75 },
    referenceId: { page: 0, x: 495, y: 61, size: 8.5, maxWidth: 85 }
  }
};

export const scheduleB = {
  firstRowY: 468,
  rowHeight: 29.25,
  maxRows: 13,
  columns: {
    // Bigger text for readability on the service-location table.
    // Slightly lowered firstRowY so larger text stays vertically centered.
    esiId: { x: 25, size: 8.2, maxWidth: 115 },
    resiCheck: { x: 165, size: 9.5 },
    commCheck: { x: 200, size: 9.5 },
    serviceAddress: { x: 226, size: 8, maxWidth: 132 },
    billingAddress: { x: 372, size: 8, maxWidth: 132 },
    estimatedStartDate: { x: 526, size: 8, maxWidth: 55 },
    taxExemptCheck: { x: 604, size: 11 },
    moveInCheck: { x: 640, size: 11 },
    switchCheck: { x: 681, size: 11 },
    estimatedAnnualKwh: { x: 718, size: 8, maxWidth: 50 }
  },
  totalAccounts: { page: 1, x: 119, y: 63, size: 8.5, maxWidth: 25 }
};

const form = document.querySelector("#apgeForm");
const commercialFields = document.querySelector("#commercialFields");
const residentialFields = document.querySelector("#residentialFields");
const locationsContainer = document.querySelector("#locations");
const locationTemplate = document.querySelector("#locationTemplate");
const addLocationButton = document.querySelector("#addLocation");
const statusEl = document.querySelector("#status");
const submitButton = document.querySelector("#submitButton");

function clean(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function formatContractPrice(value) {
  const text = clean(value);
  if (!text) return "";
  return text.replace(/¢|cents|\/kWh/gi, "").trim();
}

function formatDateForPdf(value) {
  const text = clean(value);
  if (!text) return "";

  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;

  const [, year, month, day] = match;
  return `${month}/${day}/${year.slice(2)}`;
}

function getPage(pdfDoc, field) {
  return pdfDoc.getPages()[field.page];
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

function drawText(pdfDoc, font, field, value) {
  const text = clean(value);
  if (!text) return;

  const page = getPage(pdfDoc, field);
  const size = field.size ?? 9;
  const maxWidth = field.maxWidth;

  if (!maxWidth) {
    page.drawText(text, { x: field.x, y: field.y, size, font, color: rgb(0, 0, 0) });
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

async function fillApgePdf(formData) {
  const templateResponse = await fetch(TEMPLATE_URL);
  if (!templateResponse.ok) {
    throw new Error("Could not load the APG&E PDF template.");
  }

  const templateBytes = await templateResponse.arrayBuffer();
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

  const productName = clean(formData.product?.productName || "Fixed Price");
  if (productName && productName.toLowerCase() !== "fixed price") {
    drawText(pdfDoc, font, scheduleA.product.productName, productName);
  }

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

function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);
  const signatureDate = document.querySelector("input[name='signatureDate']");
  if (signatureDate) signatureDate.value = today;
}

function addLocation() {
  const clone = locationTemplate.content.cloneNode(true);
  const card = clone.querySelector(".location-card");
  const startDate = clone.querySelector("[data-field='estimatedStartDate']");
  startDate.value = new Date().toISOString().slice(0, 10);

  clone.querySelector(".remove-location").addEventListener("click", () => {
    card.remove();
  });

  locationsContainer.appendChild(clone);
}

function toggleCustomerType() {
  const customerType = new FormData(form).get("customerType");
  commercialFields.classList.toggle("hidden", customerType !== "commercial");
  residentialFields.classList.toggle("hidden", customerType !== "residential");
}

function value(name) {
  return new FormData(form).get(name)?.toString() ?? "";
}

function getServiceLocations() {
  return Array.from(document.querySelectorAll(".location-card")).map((card) => {
    const get = (field) => card.querySelector(`[data-field='${field}']`);

    return {
      esiId: get("esiId").value,
      usedFor: get("usedFor").value,
      serviceAddress: get("serviceAddress").value,
      billingAddress: get("billingAddress").value,
      estimatedStartDate: get("estimatedStartDate").value,
      taxExempt: get("taxExempt").checked,
      enrollmentType: get("enrollmentType").value,
      estimatedAnnualKwh: get("estimatedAnnualKwh").value
    };
  });
}

function buildPayload() {
  const customerType = value("customerType");

  return {
    customerType,
    residential: {
      customerName: value("customerName"),
      email: value("residentialEmail"),
      dateOfBirth: value("dateOfBirth"),
      ssnLast4: value("ssnLast4"),
      phone: value("residentialPhone"),
      mailingAddress: value("mailingAddress")
    },
    commercial: {
      companyLegalName: value("companyLegalName"),
      dba: value("dba"),
      contactName: value("contactName"),
      contactEmail: value("contactEmail"),
      companyAddress: value("companyAddress"),
      phone: value("commercialPhone"),
      fax: value("fax")
    },
    billing: {
      attentionTo: value("attentionTo"),
      email: value("billingEmail"),
      phone: value("billingPhone"),
      federalTaxId: value("federalTaxId"),
      invoiceType: value("invoiceType"),
      deliveryPreference: value("deliveryPreference"),
      paymentMethod: value("paymentMethod"),
      language: value("language")
    },
    authorizedRep: {
      name1: value("repName"),
      title1: value("repTitle"),
      phone1: value("repPhone"),
      email1: value("repEmail")
    },
    product: {
      productName: value("productName"),
      contractPrice: value("contractPrice"),
      contractTermMonths: value("contractTermMonths")
    },
    signature: {
      printedName: value("printedName"),
      title: value("signatureTitle"),
      date: value("signatureDate"),
      referenceId: value("referenceId")
    },
    serviceLocations: getServiceLocations()
  };
}

form.addEventListener("change", (event) => {
  if (event.target.name === "customerType") toggleCustomerType();
});

addLocationButton.addEventListener("click", addLocation);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Generating PDF...";
  submitButton.disabled = true;

  try {
    const pdfBytes = await fillApgePdf(buildPayload());
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `apge-completed-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    statusEl.textContent = "PDF downloaded.";
  } catch (error) {
    console.error(error);
    statusEl.textContent = error.message || "Something went wrong.";
  } finally {
    submitButton.disabled = false;
  }
});

setDefaultDates();
addLocation();
toggleCustomerType();
