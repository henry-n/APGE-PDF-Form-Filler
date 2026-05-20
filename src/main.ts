import "./styles.css";
import { fillApgePdf } from "./fillApgePdf";
import type {
  ApgeFormData,
  CustomerType,
  DeliveryPreference,
  EnrollmentType,
  InvoiceType,
  Language,
  PaymentMethod,
  ServiceLocationFormData,
  UsedFor
} from "./types";

const form = getRequiredElement<HTMLFormElement>("#apgeForm");
const commercialFields = getRequiredElement<HTMLElement>("#commercialFields");
const residentialFields = getRequiredElement<HTMLElement>("#residentialFields");
const locationsContainer = getRequiredElement<HTMLElement>("#locations");
const locationTemplate = getRequiredElement<HTMLTemplateElement>("#locationTemplate");
const addLocationButton = getRequiredElement<HTMLButtonElement>("#addLocation");
const statusEl = getRequiredElement<HTMLParagraphElement>("#status");
const submitButton = getRequiredElement<HTMLButtonElement>("#submitButton");

const attentionToField = getRequiredElement<HTMLElement>("#attentionToField");
const billingEmailField = getRequiredElement<HTMLElement>("#billingEmailField");
const billingPhoneField = getRequiredElement<HTMLElement>("#billingPhoneField");
const federalTaxIdField = getRequiredElement<HTMLElement>("#federalTaxIdField");

const attentionToInput = getRequiredElement<HTMLInputElement>("input[name='attentionTo']");
const billingEmailInput = getRequiredElement<HTMLInputElement>("input[name='billingEmail']");
const billingPhoneInput = getRequiredElement<HTMLInputElement>("input[name='billingPhone']");
const federalTaxIdInput = getRequiredElement<HTMLInputElement>("input[name='federalTaxId']");

function getRequiredElement<T extends Element>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

function value(name: string): string {
  return new FormData(form).get(name)?.toString() ?? "";
}

function asCustomerType(valueToCheck: string): CustomerType {
  return valueToCheck === "residential" ? "residential" : "commercial";
}

function getTodayInputDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCustomerAddress(customerType: CustomerType): string {
  if (customerType === "residential") {
    return value("mailingAddress");
  }

  return value("companyAddress");
}

function getPrintedCustomerName(customerType: CustomerType): string {
  if (customerType === "residential") {
    return value("customerName");
  }

  return value("companyLegalName") || value("contactName");
}

function getDefaultBillingAttentionTo(customerType: CustomerType): string {
  if (customerType === "residential") {
    return value("customerName");
  }

  return value("attentionTo");
}

function getDefaultBillingEmail(customerType: CustomerType): string {
  if (customerType === "residential") {
    return value("residentialEmail");
  }

  return value("billingEmail");
}

function getDefaultBillingPhone(customerType: CustomerType): string {
  if (customerType === "residential") {
    return value("residentialPhone");
  }

  return value("billingPhone");
}

function syncResidentialBillingDefaults(): void {
  const customerType = asCustomerType(value("customerType"));
  const isResidential = customerType === "residential";

  attentionToField.classList.toggle("hidden", isResidential);
  billingEmailField.classList.toggle("hidden", isResidential);
  billingPhoneField.classList.toggle("hidden", isResidential);
  federalTaxIdField.classList.toggle("hidden", isResidential);

  if (isResidential) {
    attentionToInput.value = value("customerName");
    billingEmailInput.value = value("residentialEmail");
    billingPhoneInput.value = value("residentialPhone");
    federalTaxIdInput.value = "";
  }
}

function readLocationField(card: Element, field: string): HTMLInputElement | HTMLSelectElement {
  return getRequiredElement<HTMLInputElement | HTMLSelectElement>(`[data-field='${field}']`, card);
}

function syncLocationAddressFields(card: HTMLElement): void {
  const customerType = asCustomerType(value("customerType"));

  const serviceAddressInput = readLocationField(card, "serviceAddress") as HTMLInputElement;
  const billingAddressInput = readLocationField(card, "billingAddress") as HTMLInputElement;
  const useCustomerMailingAddressInput = readLocationField(card, "useCustomerMailingAddress") as HTMLInputElement;
  const sameAsServiceAddressInput = readLocationField(card, "sameAsServiceAddress") as HTMLInputElement;

  if (useCustomerMailingAddressInput.checked) {
    serviceAddressInput.value = getCustomerAddress(customerType);
    serviceAddressInput.readOnly = true;
  } else {
    serviceAddressInput.readOnly = false;
  }

  if (sameAsServiceAddressInput.checked) {
    billingAddressInput.value = serviceAddressInput.value;
    billingAddressInput.readOnly = true;
  } else {
    billingAddressInput.readOnly = false;
  }
}

function syncAllLocationAddressFields(): void {
  document.querySelectorAll<HTMLElement>(".location-card").forEach(syncLocationAddressFields);
}

function addLocation(): void {
  const clone = locationTemplate.content.cloneNode(true) as DocumentFragment;
  const card = getRequiredElement<HTMLElement>(".location-card", clone);
  const removeButton = getRequiredElement<HTMLButtonElement>(".remove-location", clone);

  const serviceAddressInput = readLocationField(card, "serviceAddress") as HTMLInputElement;
  const useCustomerMailingAddressInput = readLocationField(card, "useCustomerMailingAddress") as HTMLInputElement;
  const sameAsServiceAddressInput = readLocationField(card, "sameAsServiceAddress") as HTMLInputElement;

  removeButton.addEventListener("click", () => {
    card.remove();
  });

  serviceAddressInput.addEventListener("input", () => {
    syncLocationAddressFields(card);
  });

  useCustomerMailingAddressInput.addEventListener("change", () => {
    syncLocationAddressFields(card);
  });

  sameAsServiceAddressInput.addEventListener("change", () => {
    syncLocationAddressFields(card);
  });

  locationsContainer.appendChild(clone);
}

function toggleCustomerType(): void {
  const customerType = asCustomerType(value("customerType"));

  commercialFields.classList.toggle("hidden", customerType !== "commercial");
  residentialFields.classList.toggle("hidden", customerType !== "residential");

  syncResidentialBillingDefaults();
  syncAllLocationAddressFields();
}

function getServiceLocations(): ServiceLocationFormData[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".location-card")).map((card) => {
    syncLocationAddressFields(card);

    const taxExemptInput = readLocationField(card, "taxExempt") as HTMLInputElement;

    return {
      esiId: readLocationField(card, "esiId").value,
      usedFor: readLocationField(card, "usedFor").value as UsedFor,
      serviceAddress: readLocationField(card, "serviceAddress").value,
      billingAddress: readLocationField(card, "billingAddress").value,
      estimatedStartDate: readLocationField(card, "estimatedStartDate").value,
      taxExempt: taxExemptInput.checked,
      enrollmentType: readLocationField(card, "enrollmentType").value as EnrollmentType,
      estimatedAnnualKwh: readLocationField(card, "estimatedAnnualKwh").value
    };
  });
}

function buildPayload(): ApgeFormData {
  const customerType = asCustomerType(value("customerType"));

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
      attentionTo: getDefaultBillingAttentionTo(customerType),
      email: getDefaultBillingEmail(customerType),
      phone: getDefaultBillingPhone(customerType),
      federalTaxId: customerType === "residential" ? "" : value("federalTaxId"),
      invoiceType: value("invoiceType") as InvoiceType,
      deliveryPreference: value("deliveryPreference") as DeliveryPreference,
      paymentMethod: value("paymentMethod") as PaymentMethod,
      language: value("language") as Language
    },

    authorizedRep: {
      name1: value("repName"),
      title1: value("repTitle"),
      phone1: value("repPhone"),
      email1: value("repEmail")
    },

    product: {
      productName: "Fixed Price",
      contractPrice: value("contractPrice"),
      contractTermMonths: value("contractTermMonths")
    },

    signature: {
      printedName: getPrintedCustomerName(customerType),
      title: "Owner",
      date: getTodayInputDate()
    },

    serviceLocations: getServiceLocations()
  };
}

form.addEventListener("change", (event) => {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.name === "customerType") {
    toggleCustomerType();
  }
});

form.addEventListener("input", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.name === "customerName" || target.name === "residentialEmail" || target.name === "residentialPhone") {
    syncResidentialBillingDefaults();
  }

  if (target.name === "mailingAddress" || target.name === "companyAddress") {
    syncAllLocationAddressFields();
  }
});

addLocationButton.addEventListener("click", addLocation);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusEl.textContent = "Generating PDF...";
  submitButton.disabled = true;

  try {
    const pdfBytes = await fillApgePdf(buildPayload());
    const blob = new Blob([pdfBytes.slice().buffer], { type: "application/pdf" });
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
    statusEl.textContent = error instanceof Error ? error.message : "Something went wrong.";
  } finally {
    submitButton.disabled = false;
  }
});

addLocation();
toggleCustomerType();