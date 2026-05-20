// PDF coordinate map for the APG&E template.
// Page indexes are zero-based: page 0 = Schedule A, page 1 = Schedule B.

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