"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// VECTOR BANK

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerSignUp = document.querySelector(".signup");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnDeposit = document.querySelector(".form__btn--deposit")
const btnWithdrawal = document.querySelector(".form__btn--withdrawal")
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan--amount");
const inputWithdrawal = document.querySelector(".form__input--withdrawal--amount");
const inputDepositMov = document.querySelector(".form__input--deposit--amount")
const inputWithdrawalPin = document.querySelector(".form__input--withdrawal--pin");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//DATES
let currentDate;
const locale = navigator.language;
const optionsDateLabel = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  minute: 'numeric',
  hour: 'numeric',
}
const optionsDateMov = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
}

const displayMovements = function (movements, sort = false, dates) {
  containerMovements.innerHTML = "";
  
  const movem = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movem.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDates(i)}</div>
          <div class="movements__value">${mov} USD</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


const calcDisplaySumaryMovements = (acc) => {
  const deposits =
    acc.movements
      .filter((mov) => mov > 0)
      .reduce((deposit, mov) => deposit + mov);
  labelSumIn.textContent = deposits;
  const withdrawal = (!acc.movements.filter(mov => mov > 0)) ? 0 : acc.movements.filter((mov) => mov < 0).reduce((deposit, mov) => deposit + mov, 0);
  labelSumOut.textContent = Math.abs(withdrawal);
  const interest = acc.movements
    .filter((deposit) => deposit > 0)
    .map((mov) => mov * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((accInt, mov) => accInt + mov, 0);
  labelSumInterest.textContent = interest.toFixed(2);
  const ballance = (deposits + withdrawal);
  acc.ballance = ballance;
  labelBalance.textContent = `${acc.ballance} USD`;
  const dateLabel = currentDate.toLocaleDateString(locale, optionsDateLabel);
  labelDate.textContent = dateLabel;
};

const addDates = () => {
  currentAccount.movementsDates.push(new Date());
}

const displayDates = i => {
  const movDate = new Date(currentAccount.movementsDates[i]) 
  const timestamp = (24 * 60 * 60 * 1000)
  if(+currentDate - +movDate <= timestamp) {
    return 'Today'
  } else if (+currentDate - +movDate > timestamp && +currentDate - +movDate <= 2 * timestamp) {
    return 'Yesterday'
  } else {
    return currentDate;
  };
}

//updating interface
const updateUI = (currentAcc) => {
  //display movements
  displayMovements(currentAcc.movements);
  //display balance and summary
  calcDisplaySumaryMovements(currentAcc);
};

//function to activate the app (login) and keep track of the logged account
let currentKey;
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentKey = inputLoginUsername.value;
  currentAccount = JSON.parse(localStorage.getItem(currentKey))

  //validating the user's pin
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    //display UI container
    containerSignUp.style.display = "none";
    containerApp.style.opacity = "100%";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    currentDate = new Date();
    updateUI(currentAccount);
  } else {
    alert('invalid user')
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();
  }
});

//transfer function
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const ammount = Number(inputTransferAmount.value);
  const receiverAccount = JSON.parse(localStorage.getItem(inputTransferTo.value))
  console.log(Number(currentAccount.ballance))
  //cleaning the input
  inputTransferTo.value = inputTransferAmount.value = ""
  inputTransferAmount.blur();

  //validating the account and the ammout to transfer
  if (
    ammount > 0 &&
    receiverAccount &&
    Number(currentAccount.ballance) >= ammount &&
    receiverAccount?.id !== currentAccount.id
  ) {

    //transfer transaction
    currentAccount.movements.push(-ammount);
    addDates(currentAccount);
    localStorage.setItem(currentKey, JSON.stringify(currentAccount))
    receiverAccount.movements.push(ammount);
    addDates(receiverAccount);
    localStorage.setItem(receiverAccount.id, JSON.stringify(receiverAccount))

    //updating UI after transfer
    addDates(currentAccount)
    updateUI(currentAccount);
  } else {
    console.log('error')
  }
});

//request loan function - if the account has a deposit value that is at least 10% of the requested loan value
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const loanMinTax = 0.1; //10% - min percentage of deposit for the loan to be granted
  const requestLoan = Number(inputLoanAmount.value);
  if (currentAccount.movements.some(mov => mov >= requestLoan * loanMinTax)) {
    currentAccount.movements.push(requestLoan);
    addDates(currentAccount);
    updateUI(currentAccount);
    localStorage.setItem(currentKey, JSON.stringify(currentAccount));

  } else {
    alert(`The value requested of $${requestLoan} USD was denied`);
  }
  inputLoanAmount.blur()
  inputLoanAmount.value = "";

});

//function to add movement, wether it be deposit or withdrawal.
const withdrawalOrDeposit = value => {
  currentAccount.movements.push(value);
  addDates(currentAccount);
  updateUI(currentAccount);
  inputWithdrawalPin.blur()
  inputWithdrawalPin.value = "";
  localStorage.setItem(currentKey, JSON.stringify(currentAccount))
}

//withdrawal function
btnWithdrawal.addEventListener('click', function(e) {
  e.preventDefault();
  
  const withdrawal = Number(inputWithdrawal.value)
  if(withdrawal <= Number(currentAccount.ballance) && currentAccount.pin === Number(inputWithdrawalPin.value)){
    withdrawalOrDeposit(-withdrawal);
  } else{
    alert('withdrawal not allowerd')
  }
  inputWithdrawal.value = "";
  inputWithdrawal.blur();
});

//deposit function
btnDeposit.addEventListener('click', function(e){
  e.preventDefault();

  const deposit = Number(inputDepositMov.value)
  withdrawalOrDeposit(deposit);

  inputDepositMov.value = "";
  inputDepositMov.blur();
})


//close account function
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.id && Number(inputClosePin.value) === currentAccount.pin) {
    localStorage.removeItem(currentAccount.id);
    labelWelcome.textContent = `Good bye, ${currentAccount.owner.split(" ")[0]} 👋🏼`;
    setTimeout(() => {location.reload()}, 2000)
  }
  containerApp.style.opacity = "0";
});

//sort function
let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


// ----- FEATURES TO IMPLEMENT
// --------- 1. currency using a button
// ------------ 1.1 Create a property 'movements' for both currencies (main currency and secondary currency)
// ------------ 1.2 Use a method to convert the movements of the main currency and generate the secondary currency movements
// ---------- 2. Create functions as variables to use as callback functions
// ------------ 2.1 Create a variable to the callback function 'deposit'
// ------------ 2.1 Create a variable to the callback function 'withdrawal'
