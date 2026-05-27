// --- VARIABLES ------------------------------------
const billAmountEl = document.getElementById("bill-amount");
const btnPercentEl = document.querySelectorAll(".btn__percent");
const tipCustomEl = document.getElementById("tip-custom");
const peopleQtytEl = document.getElementById("people-qty");
const tipAmountEl = document.getElementById("tip-amount");
const totalAmountEl = document.getElementById("total-amount");
const btnReset = document.querySelector(".btn__reset");

let percentSelected = 0;

// --- LISTENER --------------------------------------
// * Listener buttons ---
btnPercentEl.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active from all buttons
    initBtn();
    // clear input custom
    tipCustomEl.value = "";
    // add active to clicked
    btn.classList.add("active");
    percentSelected = Number(btn.dataset.percent);
    calcul();
  });
});
// * Listener tip ---
tipCustomEl.addEventListener("change", (event) => {
  // remove active from all buttons
  initBtn();

  calcul();
});
// * Listener bill ---
// billAmountEl.addEventListener("change", () => {
//   calcul();
// });
// * Listener people ---
peopleQtytEl.addEventListener("change", () => {
  calcul();
});
// * Listener btn reset ---
btnReset.addEventListener("click", () => {
  reset();
});

// Interdire les caractères non autorisés
document.querySelectorAll(".numeric-only").forEach((input) => {
  input.addEventListener("input", function () {
    const cursor = this.selectionStart;
    const oldVal = this.value;

    // Garder uniquement chiffres
    let val = this.value.replace(/[^0-9]/g, "");

    // Convertir en nombre
    const num = parseInt(val, 10);

    // apply a limit
    limit(num, val);

    this.value = val;

    // Repositionner le curseur
    const delta = oldVal.length - val.length;
    console.log(delta);
    const newPos = Math.max(0, Math.min(cursor + delta, val.length));
    console.log(newPos);
    this.setSelectionRange(newPos, newPos);
  });
});

function limit(num, val) {
  console.log(num);
  if (!isNaN(num)) {
    console.log("in");
    if (num < 0) val = "0";
    else if (num > 99999) val = "99999";
  }
  return;
}

// --- FUNCTIONS --------------------------------------
// * Calcul ---
function calcul() {
  const bill = billAmountEl.value.trim();
  const tipCustom = tipCustomEl.value.trim();
  const people = peopleQtytEl.value.trim();

  let tipAmount = 0;
  let tipValue = 0;
  let total = 0;

  // Convertion en nombre
  const numBill = Number(bill);
  const numTipCustom = Number(tipCustom);
  const numPeople = Number(people);

  if (numBill === 0 || numPeople === 0) {
    return;
  }

  // select tip
  if (numTipCustom !== 0) {
    tipValue = numTipCustom;
  }
  if (percentSelected !== 0) {
    tipValue = percentSelected;
  }

  // calcul tip
  tipAmount = (numBill * tipValue) / 100;

  // calcul total
  total = numBill * numPeople + tipAmount;

  // display results
  tipAmountEl.textContent = `$${tipAmount / numPeople}`;
  totalAmountEl.textContent = "$" + total;

  // enabled the reset button
  btnReset.disabled = false;
}

// * Reset ---
function reset() {
  // init input
  billAmountEl.value = "";
  tipCustomEl.value = "";
  peopleQtytEl.value = "";

  tipAmountEl.textContent = "$0.00";
  totalAmountEl.textContent = "$0.00";

  // init buttons
  initBtn();

  // disabled the reset buton
  btnReset.disabled = true;
}

// * Init btn percent ---
function initBtn() {
  // remove active from all buttons
  btnPercentEl.forEach((b) => b.classList.remove("active"));
  percentSelected = 0;
}
