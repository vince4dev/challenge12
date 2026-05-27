// -----------------------------------------------------------------------------
// --- Retrieving DOM elements ---
// -----------------------------------------------------------------------------
const billAmountEl = document.getElementById("bill-amount"); // input bill
const tipCustomEl = document.getElementById("tip-custom"); // input tip custom
const peopleNbrEl = document.getElementById("people-nbr"); // input number of people
const tipAmountEl = document.getElementById("tip-amount"); // display per personne
const totalAmountEl = document.getElementById("total-amount"); // display total
const btnReset = document.querySelector(".btn__reset"); // button reset
const btnPercentEls = document.querySelectorAll(".btn__percent"); // Retrieve all percentage buttons
const numericInputs = document.querySelectorAll(".numeric-only");

// -----------------------------------------------------------------------------
// --- Selected percent value button ---
// -----------------------------------------------------------------------------
let percentSelected = 0;

//* Listener for percentage buttons
btnPercentEls.forEach((btn) => {
  btn.addEventListener("click", () => {
    percentSelected = Number(btn.dataset.percent);
  });
});

// -----------------------------------------------------------------------------
// --- Calculation function ---
// -----------------------------------------------------------------------------
function calculation() {
  //* Input validation
  validateInput();

  //* Recover and clean the values
  const billRaw = billAmountEl.value.trim();
  const tipCustomRaw = tipCustomEl.value.trim();
  const peopleNbrRaw = peopleNbrEl.value.trim();

  //* Convert to numbers
  const numBill = Number(billRaw);
  const numTipCustom = Number(tipCustomRaw);
  const numPeopleNbr = Number(peopleNbrRaw);

  //* Determine the percentage of tip to apply
  let tipPercent = percentSelected; // by default, the button is selected
  if (percentSelected === 0 && numTipCustom > 0) {
    tipPercent = numTipCustom; // otherwise we'll take the custom tip
  }
  if (tipPercent === 0) tipPercent = 0; // if there is no tip

  //* Calculations
  if (numBill !== 0 && numPeopleNbr !== 0) {
    const tipTotal = (numBill * tipPercent) / 100; // total tip
    const perPersonTip = tipTotal / numPeopleNbr; // tip per person

    const totalBillWithTip = numBill / numPeopleNbr; // total amount per person

    //* Formatted display
    tipAmountEl.textContent = `$${perPersonTip.toFixed(2)}`;
    totalAmountEl.textContent = `$${totalBillWithTip.toFixed(2)}`;

    //* Activate the reset button
    btnReset.disabled = false;
  }
}

// -----------------------------------------------------------------------------
// --- Link the function to the input events ---
// -----------------------------------------------------------------------------
//* Input bill
billAmountEl.addEventListener("input", calculation);

//* Input custom tip
tipCustomEl.addEventListener("input", () => {
  percentSelected = 0;
  calculation();
});

//* Input people number
peopleNbrEl.addEventListener("input", () => {
  const num = Number(peopleNbrEl.value.trim());
  if (num === 0) {
    resetResults();
  }

  calculation();
});

// -----------------------------------------------------------------------------
// --- Reset ---
// -----------------------------------------------------------------------------
//* Reset inputs
btnReset.addEventListener("click", () => {
  billAmountEl.value = "";
  tipCustomEl.value = "";
  peopleNbrEl.value = "";
  percentSelected = 0;
  btnReset.disabled = true;
  resetResults();
  removeOutlineError(billAmountEl);
  removeOutlineError(peopleNbrEl);
  clearError(billAmountEl);
  clearError(peopleNbrEl);
  btnRemoveActive();
});

//* Reset buttons
function btnRemoveActive() {
  btnPercentEls.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
}

//* Reset people number
function resetResults() {
  tipAmountEl.textContent = "$0.00";
  totalAmountEl.textContent = "$0.00";
}

// -----------------------------------------------------------------------------
// --- Manage the “active” state of each button ---
// -----------------------------------------------------------------------------
btnPercentEls.forEach((btn) => {
  btn.addEventListener("click", () => {
    const isActive = btn.classList.contains("active");

    //* Remove "active" from all buttons except the one that is already active.
    if (!isActive) {
      btnRemoveActive();
    }

    //* activate / deactivate only the clicked button
    btn.classList.toggle("active");

    if (!isActive) {
      btn.setAttribute("aria-selected", "true");
    }

    //* Retrieve the value stored in data-percent
    if (isActive) {
      percentSelected = 0;
    } else {
      percentSelected = Number(btn.dataset.percent);
    }

    //* Reset the custom input
    tipCustomEl.value = "";

    //* Start the calculation
    calculation();
  });
});

// -----------------------------------------------------------------------------
// --- When the custom input changes: disable the buttons ---
// -----------------------------------------------------------------------------
tipCustomEl.addEventListener("input", () => {
  //* Remove the active component from each button
  btnRemoveActive();

  //* Restart the calculation
  calculation();
});

// -----------------------------------------------------------------------------
// --- Manage errors ---
// -----------------------------------------------------------------------------
//* Display message error
const showError = (input, msg) => {
  const errSpan = input.parentElement.querySelector(".error-msg");

  if (errSpan) {
    errSpan.textContent = msg;
    errSpan.style.display = "block";
  }
};

//* Hide message error
const clearError = (input) => {
  const errSpan = input.parentElement.querySelector(".error-msg");
  if (errSpan) {
    errSpan.textContent = "";
    errSpan.style.display = "none";
  }
};

//* Remove CSS outline
const removeOutlineError = (input) => {
  input.classList.remove("error-outline");
};

//* Add CSS outline
const addOutlineError = (input) => {
  input.classList.add("error-outline");
};

// --- Numeric input only ----------------------------
numericInputs.forEach((input) => {
  const MAX_LEN = 9;

  input.addEventListener("keydown", (e) => {
    const key = e.key;

    //* Allow control keys (Ctrl, Cmd, Backspace, Delete, Tab, Arrow keys)
    if (
      e.ctrlKey ||
      e.metaKey ||
      key === "Backspace" ||
      key === "Delete" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Tab" ||
      key === "."
    )
      return;

    //* Blocks everything except numbers and the dot
    if (!/^[0-9]$/.test(e.key) && e.key !== ".") {
      e.preventDefault();
      return;
    }

    //* If the limit has already been reached, prevent the addition of new characters.
    if (input.value.length >= MAX_LEN) {
      e.preventDefault();
      return;
    }
  });

  // --- Cleaning after any modification (paste, drag‑drop…) ----------------------------
  input.addEventListener("input", (e) => {
    //* Keep only the numbers
    let cleaned = input.value.replace(/[^0-9\.]/g, "");

    //* Limit to MAX_LEN
    if (cleaned.length > MAX_LEN) {
      cleaned = cleaned.slice(0, MAX_LEN);
    }

    //* If the value has changed, we display it.
    if (cleaned !== input.value) {
      input.value = cleaned;
    }

    //* Rerun the calculator after cleaning
    calculation();
  });
});

// --- Validator function ----------------------------
const validator =
  (el, { message, check }) =>
  () => {
    const value = el.value.trim();

    if (!check(value)) {
      showError(el, message);
      addOutlineError(el);
      return false;
    }

    clearError(el);
    removeOutlineError(el);
    return true;
  };

const validateInput = () => runValidators(billValidator, peopleValidator);

const runValidators = (...fns) => fns.every((fn) => fn());

const billValidator = validator(billAmountEl, {
  message: "Can't be zero",
  check: (value) => value !== 0 && Number(value) > 0,
});

const peopleValidator = validator(peopleNbrEl, {
  message: "Can't be zero",
  check: (value) => value !== 0 && Number(value) > 0,
});
