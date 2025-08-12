
// Data pricing tables (from user's original bundles)
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

// Update service prices live
function bindPrice(selectId, priceSpanId){
  const sel = document.getElementById(selectId);
  const span = document.getElementById(priceSpanId);
  if(!sel || !span) return;
  sel.addEventListener("change", e => {
    span.textContent = e.target.selectedOptions[0].dataset.price;
  });
}
bindPrice("netflix-plan","netflix-price");
bindPrice("audio-plan","audio-price");
bindPrice("bece-qty","bece-price");
bindPrice("wassce-qty","wassce-price");

// WhatsApp helpers
function encode(s){return encodeURIComponent(s)}

function openWhatsApp(label, net){
  const sel = document.querySelector(`select[data-network="${net}"]`);
  const num = document.getElementById(`${net}-number`).value.trim();
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  if(!/^\d{10}$/.test(num)){
    alert("Enter a valid 10‑digit recipient number (e.g., 0551234567)");
    return;
  }
  const msg = `Hello Qwomenz Consult,%0AI want to buy ${label} data.%0APlan: ${plan}%0ARecipient: ${num}%0APrice: GHS ${price}`;
  window.open(`https://wa.me/233555610075?text=${msg}`,"_blank","noopener");
}

function openService(service, selectId){
  const sel = document.getElementById(selectId);
  const plan = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const msg = `Hello Qwomenz Consult,%0AI want to buy ${service}.%0APlan: ${plan}%0APrice: GHS ${price}`;
  window.open(`https://wa.me/233555610075?text=${msg}`,"_blank","noopener");
}

function openChecker(kind, selectId){
  const sel = document.getElementById(selectId);
  const qty = sel.value;
  const price = sel.selectedOptions[0].dataset.price;
  const msg = `Hello Qwomenz Consult,%0AI want ${kind} result checker.%0AQuantity: ${qty}%0APrice: GHS ${price}`;
  window.open(`https://wa.me/233555610075?text=${msg}`,"_blank","noopener");
}
