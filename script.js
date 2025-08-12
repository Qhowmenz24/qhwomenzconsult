
const WA = "233592848359";
const SMS = "+233592848359";

// Data pricing tables
const plans = {
  mtn: [
    ["1 GB", 6], ["2 GB", 12], ["3 GB", 17], ["4 GB", 22], ["5 GB", 28],
    ["6 GB", 33], ["7 GB", 39], ["8 GB", 44], ["10 GB", 50], ["15 GB", 75],
    ["20 GB", 95], ["25 GB", 110], ["30 GB", 130], ["40 GB", 170], ["50 GB", 210], ["100 GB", 410]
  ],
  at: [
    ["1 GB", 5], ["2 GB", 10], ["3 GB", 15], ["4 GB", 19], ["5 GB", 24],
    ["6 GB", 28], ["7 GB", 33], ["8 GB", 38], ["9 GB", 40], ["10 GB", 45],
    ["15 GB", 65], ["20 GB", 85], ["30 GB", 130], ["40 GB", 172], ["50 GB", 210], ["100 GB", 315]
  ],
  telecel: [
    ["5 GB", 27], ["10 GB", 49], ["15 GB", 65], ["20 GB", 90],
    ["30 GB", 130], ["40 GB", 170], ["50 GB", 200], ["100 GB", 320]
  ]
};

function initDropdown(net){
  const select = document.querySelector(`select[data-network="${net}"]`);
  if(!select) return;
  select.innerHTML = plans[net].map(([label, price]) => `<option value="${label}" data-price="${price}">${label} — GHS ${price}</option>`).join("");
  const priceEl = document.getElementById(`${net}-price`);
  priceEl.textContent = plans[net][0][1];
  select.addEventListener("change", e => {
    const p = e.target.selectedOptions[0].dataset.price;
    priceEl.textContent = p;
  });
}
["mtn","at","telecel"].forEach(initDropdown);

function bindPrice(selectId, priceSpanId){
  const sel = document.getElementById(selectId);
  const span = document.getElementById(priceSpanId);
  if(!sel || !span) return;
  sel.addEventListener("change", e => { span.textContent = e.target.selectedOptions[0].dataset.price; });
}
bindPrice("netflix-plan","netflix-price");
bindPrice("audio-plan","audio-price");
bindPrice("bece-qty","bece-price");
bindPrice("wassce-qty","wassce-price");

function openWhatsApp(label, net){
  const sel = document.querySelector(`select[data-network="${net}"]`);
  const num = document.getElementById(`${net}-number`).value.trim();
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  if(!/^\d{10}$/.test(num)){ alert("Enter a valid 10‑digit recipient number (e.g., 0551234567)"); return; }
  const msg = `Hello Qhowmenz Consult,%0AI want to buy ${label} data.%0APlan: ${plan}%0ARecipient: ${num}%0APrice: GHS ${price}`;
  window.open(`https://wa.me/${WA}?text=${msg}`,"_blank","noopener");
}
function openService(service, selectId){
  const sel = document.getElementById(selectId);
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const msg = `Hello Qhowmenz Consult,%0AI want to buy ${service}.%0APlan: ${plan}%0APrice: GHS ${price}`;
  window.open(`https://wa.me/${WA}?text=${msg}`,"_blank","noopener");
}
function openChecker(kind, selectId){
  const sel = document.getElementById(selectId);
  const qty = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const msg = `Hello Qhowmenz Consult,%0AI want ${kind} result checker.%0AQuantity: ${qty}%0APrice: GHS ${price}`;
  window.open(`https://wa.me/${WA}?text=${msg}`,"_blank","noopener");
}

// ---- SMS helpers (cross‑device) ----
function smsLink(body){
  const encoded = encodeURIComponent(body);
  const base = `sms:${SMS}`;
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return base + "&body=" + encoded;
  return base + "?body=" + encoded;
}
function openSMSData(label, net){
  const sel = document.querySelector(`select[data-network="${net}"]`);
  const num = document.getElementById(`${net}-number`).value.trim();
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  if(!/^\d{10}$/.test(num)){ alert("Enter a valid 10‑digit recipient number (e.g., 0551234567)"); return; }
  const body = `Hello Qhowmenz Consult, I want to buy ${label} data.\nPlan: ${plan}\nRecipient: ${num}\nPrice: GHS ${price}`;
  window.location.href = smsLink(body);
}
function openSMSService(service, selectId){
  const sel = document.getElementById(selectId);
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const body = `Hello Qhowmenz Consult, I want to buy ${service}.\nPlan: ${plan}\nPrice: GHS ${price}`;
  window.location.href = smsLink(body);
}
function openSMSChecker(kind, selectId){
  const sel = document.getElementById(selectId);
  const qty = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const body = `Hello Qhowmenz Consult, I want ${kind} result checker.\nQuantity: ${qty}\nPrice: GHS ${price}`;
  window.location.href = smsLink(body);
}

// ---- Paystack integration ----
function promptBuyerInfo() {
  const email = prompt("Enter your email for receipt (required):");
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Valid email required."); return null; }
  const name = prompt("Enter your full name (optional):") || "";
  const phone = prompt("Enter your phone number (optional):") || "";
  return { email, name, phone };
}
function paystackCheckout(amountGHS, description, metadata) {
  const info = promptBuyerInfo();
  if(!info) return;
  const handler = PaystackPop.setup({
    key: "pk_test_e7b1e05de054d8690e53d67f2257928415dc9521",
    email: info.email,
    amount: Math.round(Number(amountGHS) * 100),
    currency: "GHS",
    ref: "QH-" + Date.now(),
    metadata: { custom_fields: [
      { display_name: "Name", variable_name: "name", value: info.name },
      { display_name: "Phone", variable_name: "phone", value: info.phone },
      { display_name: "Details", variable_name: "details", value: description },
      { display_name: "Meta", variable_name: "meta", value: JSON.stringify(metadata||{}) }
    ]},
    callback: function(response) {
      alert("Payment successful! Ref: " + response.reference);
      const msg = encodeURIComponent("Payment successful. Ref: " + response.reference + "\n" + description);
      window.open(`https://wa.me/${WA}?text=${msg}`,"_blank","noopener");
    },
    onClose: function(){ alert("Payment window closed."); }
  });
  handler.openIframe();
}
function payDataWithPaystack(label, net) {
  const sel = document.querySelector(`select[data-network="${net}"]`);
  const num = document.getElementById(`${net}-number`).value.trim();
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  if(!/^\d{10}$/.test(num)){ alert("Enter a valid 10‑digit recipient number."); return; }
  const desc = `${label} data — Plan: ${plan} — Recipient: ${num} — GHS ${price}`;
  paystackCheckout(price, desc, { type:"data", network:label, plan, recipient:num });
}
function payServiceWithPaystack(service, selectId) {
  const sel = document.getElementById(selectId);
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const desc = `${service} — Plan: ${plan} — GHS ${price}`;
  paystackCheckout(price, desc, { type:"service", service, plan });
}
function payCheckerWithPaystack(kind, selectId) {
  const sel = document.getElementById(selectId);
  const qty = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const desc = `${kind} result checker — Qty: ${qty} — GHS ${price}`;
  paystackCheckout(price, desc, { type:"checker", kind, qty });
}
