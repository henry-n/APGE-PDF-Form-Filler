// PDF coordinate map for the APG&E template.
// Page indexes are zero-based: page 0 = Schedule A, page 1 = Schedule B.
//
// Coordinate notes:
// - Schedule A is portrait letter: 612 x 792 pt.
// - Schedule B is landscape letter: 792 x 612 pt.
// - PDF coordinates start at the bottom-left of each page.
// - Increasing x moves right. Increasing y moves up.
// - These values are tuned against the included normalized APG&E template.

export const scheduleA = {
  residential: {
    customerName: { page: 0, x: 105, y: 682, size: 8.5, maxWidth: 190 },
    email: { page: 0, x: 345, y: 682, size: 8.5, maxWidth: 210 },
    dateOfBirth: { page: 0, x: 175, y: 667, size: 8.5, maxWidth: 80 },
    ssnLast4: { page: 0, x: 350, y: 667, size: 8.5, maxWidth: 45 },
    phone: { page: 0, x: 455, y: 667, size: 8.5, maxWidth: 100 },
    mailingAddress: { page: 0, x: 115, y: 652, size: 8, maxWidth: 440 }
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
    contractTermMonths: { page: 0, x: 165, y: 398, size: 8.5, maxWidth: 50 },
    monthlyCharge: { page: 0, x: 290, y: 398, size: 8.5, maxWidth: 60 }
  },

  signature: {
    printedName: { page: 0, x: 470, y: 92, size: 8.5, maxWidth: 140 },
    title: { page: 0, x: 435, y: 77, size: 8.5, maxWidth: 140 },
    date: { page: 0, x: 125, y: 61, size: 8.5, maxWidth: 75 },
    referenceId: { page: 0, x: 495, y: 61, size: 8.5, maxWidth: 85 }
  }
};

export const scheduleB = {
  firstRowY: 471,
  rowHeight: 29.25,
  maxRows: 13,
  columns: {
    esiId: { x: 28, size: 6.6, maxWidth: 108 },
    resiCheck: { x: 162, size: 8.5 },
    commCheck: { x: 198, size: 8.5 },
    serviceAddress: { x: 228, size: 6.2, maxWidth: 125 },
    billingAddress: { x: 374, size: 6.2, maxWidth: 125 },
    estimatedStartDate: { x: 528, size: 6.6, maxWidth: 45 },
    taxExemptCheck: { x: 604, size: 8.5 },
    moveInCheck: { x: 643, size: 8.5 },
    switchCheck: { x: 681, size: 8.5 },
    estimatedAnnualKwh: { x: 719, size: 6.6, maxWidth: 45 }
  },
  totalAccounts: { page: 1, x: 119, y: 63, size: 8.5, maxWidth: 25 }
};