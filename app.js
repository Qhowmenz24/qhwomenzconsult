// ====== CONFIG: Edit only the prices/labels below ======
// Use your original bundle prices here (examples included; replace with your real list)
const DATA_PLANS = {
  "mtn": [
    {
      label: "1 GB",
      price: 6
    },
    {
      label: "2 GB",
      price: 12
    },
    {
      label: "3 GB",
      price: 17
    },
    {
      label: "4 GB",
      price: 22
    },
    {
      label: "5 GB",
      price: 28
    },
    {
      label: "6 GB",
      price: 33
    },
    {
      label: "7 GB",
      price: 39
    },
    {
      label: "8 GB",
      price: 44
    },
    {
      label: "10 GB",
      price: 50
    },
    {
      label: "15 GB",
      price: 75
    },
    {
      label: "20 GB",
      price: 95
    },
    {
      label: "25 GB",
      price: 110
    },
    {
      label: "30 GB",
      price: 130
    },
    {
      label: "40 GB",
      price: 170
    },
    {
      label: "50 GB",
      price: 210
    },
    {
      label: "100 GB",
      price: 410
    }
  ],
  "at": [
    {
      label: "1 GB",
      price: 5
    },
    {
      label: "2 GB",
      price: 10
    },
    {
      label: "3 GB",
      price: 15
    },
    {
      label: "4 GB",
      price: 19
    },
    {
      label: "5 GB",
      price: 24
    },
    {
      label: "6 GB",
      price: 28
    },
    {
      label: "7 GB",
      price: 33
    },
    {
      label: "8 GB",
      price: 38
    },
    {
      label: "9 GB",
      price: 40
    },
    {
      label: "10 GB",
      price: 45
    },
    {
      label: "15 GB",
      price: 65
    },
    {
      label: "20 GB",
      price: 85
    },
    {
      label: "30 GB",
      price: 130
    },
    {
      label: "40 GB",
      price: 172
    },
    {
      label: "50 GB",
      price: 210
    },
    {
      label: "100 GB",
      price: 315
    }
  ],
  "telecel": [
    {
      label: "5 GB",
      price: 27
    },
    {
      label: "10 GB",
      price: 49
    },
    {
      label: "15 GB",
      price: 65
    },
    {
      label: "20 GB",
      price: 90
    },
    {
      label: "30 GB",
      price: 130
    },
    {
      label: "40 GB",
      price: 170
    },
    {
      label: "50 GB",
      price: 200
    },
    {
      label: "100 GB",
      price: 320
    }
  ]
};

// Result checker prices
const RC_PRICES = { bece: 25, wassce: 30 };

// WhatsApp target
const WA_NUMBER = "233555610075";

// ====== Helpers ======
function ghValid(num) {
  return /^0\d{9}$/.test(num);
}

function fillSelect(id, items) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  items.forEach(p => {
    const o = document.createElement("option");
    o.value = p.price;
    o.textContent = p.label;
    sel.appendChild(o);
  });
}

function bindDataCard(prefix) {
  const sel = document.getElementById(prefix + "Plan");
  const priceEl = document.getElementById(prefix + "Price");
  const phoneEl = document.getElementById(prefix + "Number");
  const buyBtn = document.getElementById(prefix + "Buy");

  function updatePrice() {
    if (!sel.value) { priceEl.textContent = "—"; return; }
    priceEl.textContent = Number(sel.value).toFixed(2);
  }
  sel.addEventListener("change", updatePrice);
  updatePrice();

  buyBtn.addEventListener("click", () => {
    const plan = sel.options[sel.selectedIndex]?.text || "";
    const price = sel.value;
    const phone = phoneEl.value.trim();
    if (!ghValid(phone)) {
      alert("Enter a valid Ghana number (starts with 0 and has 10 digits).");
      phoneEl.focus();
      return;
    }
    const msg = encodeURIComponent(`Order: ${prefix.toUpperCase()} DATA\nPlan: ${plan}\nPrice: GHS ${price}\nNumber: ${phone}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  });
}

// Result checker bindings
function updateRcPrice(kind){
  const qty = Number(document.getElementById(kind+'Qty').value);
  const unit = RC_PRICES[kind];
  const total = qty * unit;
  document.getElementById(kind+'Price').textContent = total.toFixed(2);
}

function waOrderRc(kind, label){
  const qty = document.getElementById(kind+'Qty').value;
  const idx = document.getElementById(kind+'Index')?.value.trim() || "";
  const yr  = document.getElementById(kind+'Year')?.value.trim() || "";
  const total = document.getElementById(kind+'Price').textContent;
  const lines = [
    `Order: ${label} Result Checker`,
    `Qty: ${qty}`,
    `Total: GHS ${total}`,
    idx ? `Index: ${idx}` : null,
    yr  ? `Exam Year: ${yr}` : null
  ].filter(Boolean).join('\n');
  const msg = encodeURIComponent(lines);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
}

// Netflix & Audiomack simple binds
function bindSimplePrice(selectId, priceId, label){
  const sel = document.getElementById(selectId);
  const priceEl = document.getElementById(priceId);
  function upd(){ priceEl.textContent = Number(sel.value).toFixed(2); }
  sel.addEventListener("change", upd); upd();
}

function waSimple(label, selectId){
  const sel = document.getElementById(selectId);
  const plan = sel.options[sel.selectedIndex].text;
  const price = sel.value;
  const msg = encodeURIComponent(`Order: ${label}\nPlan: ${plan}\nTotal: GHS ${price}`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
}

// ====== Init ======
window.addEventListener("DOMContentLoaded", () => {
  fillSelect("mtnPlan", DATA_PLANS.mtn);
  fillSelect("atPlan", DATA_PLANS.at);
  fillSelect("telecelPlan", DATA_PLANS.telecel);

  bindDataCard("mtn");
  bindDataCard("at");
  bindDataCard("telecel");

  ['bece','wassce'].forEach(k=>{
    document.getElementById(k+'Qty').addEventListener('change',()=>updateRcPrice(k));
    updateRcPrice(k);
  });
  document.getElementById('beceBuy').onclick = ()=>waOrderRc('bece','BECE');
  document.getElementById('wassceBuy').onclick = ()=>waOrderRc('wassce','WASSCE');

  // Netflix/Audiomack
  bindSimplePrice("netflixPlan","netflixPrice","Netflix");
  bindSimplePrice("audioPlan","audioPrice","Audiomack");
  document.getElementById("netflixBuy").addEventListener("click",()=>waSimple("Netflix Shared Account","netflixPlan"));
  document.getElementById("audioBuy").addEventListener("click",()=>waSimple("Audiomack Premium (Android)","audioPlan"));

  // AFA quick
  document.getElementById("afaBuy").addEventListener("click",()=>{
    const msg = encodeURIComponent("AFA Registration\nRequirements: Full name + number to be registered");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,"_blank");
  });
});
