export type CustomerType = "commercial" | "residential";
export type InvoiceType = "" | "individual" | "summary";
export type DeliveryPreference = "" | "email" | "usps" | "both";
export type PaymentMethod = "" | "ach" | "check";
export type Language = "" | "english" | "spanish";
export type UsedFor = "" | "comm" | "resi";
export type EnrollmentType = "" | "switch" | "move-in";

export interface PdfField {
  page: number;
  x: number;
  y: number;
  size?: number;
  maxWidth?: number;
}

export interface RowColumn {
  x: number;
  size?: number;
  maxWidth?: number;
}

export interface ServiceLocationFormData {
  esiId: string;
  usedFor: UsedFor;
  serviceAddress: string;
  billingAddress: string;
  estimatedStartDate: string;
  taxExempt: boolean;
  enrollmentType: EnrollmentType;
  estimatedAnnualKwh: string;
}

export interface ApgeFormData {
  customerType: CustomerType;
  residential: {
    customerName: string;
    email: string;
    dateOfBirth: string;
    ssnLast4: string;
    phone: string;
    mailingAddress: string;
  };
  commercial: {
    companyLegalName: string;
    dba: string;
    contactName: string;
    contactEmail: string;
    companyAddress: string;
    phone: string;
    fax: string;
  };
  billing: {
    attentionTo: string;
    email: string;
    phone: string;
    federalTaxId: string;
    invoiceType: InvoiceType;
    deliveryPreference: DeliveryPreference;
    paymentMethod: PaymentMethod;
    language: Language;
  };
  authorizedRep: {
    name1: string;
    title1: string;
    phone1: string;
    email1: string;
  };
  product: {
    contractPrice: string;
    contractTermMonths: string;
  };
  signature: {
    printedName: string;
    title: "Owner";
    date: string;
  };
  serviceLocations: ServiceLocationFormData[];
}
