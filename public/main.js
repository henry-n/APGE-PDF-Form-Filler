const form = document.querySelector("#apgeForm");
const commercialFields = document.querySelector("#commercialFields");
const residentialFields = document.querySelector("#residentialFields");
const locationsContainer = document.querySelector("#locations");
const locationTemplate = document.querySelector("#locationTemplate");
const addLocationButton = document.querySelector("#addLocation");
const statusEl = document.querySelector("#status");
const submitButton = document.querySelector("#submitButton");

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
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload())
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "PDF generation failed");
    }

    const blob = await response.blob();
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
