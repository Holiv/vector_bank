"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const currency = {
  USD: 1,
  EUR: 1.1,
  
  changeEurToUSD() {
    return this.eurToUSD = (this.USD * this.EUR).toFixed(5);
  },
  changeUSDToEur() {
    return this.usdToEUR = (this.USD / this.EUR).toFixed(5);
  }
}

const change = (cc) => {
  const currencyChange = cc * currency.changeEurToUSD()
  return currencyChange;
}

const accountAdmin = {
  owner: "admin",
  movements: [0],
  interestRate: 0, // %
  pin: 9999,
  createUserName() {
    return (this.username = this.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join(""));
  },
}
accountAdmin.createUserName();
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};
// account1.createUserName.call(account3)

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
// account1.createUserName.call(account4)

const accounts = [accountAdmin, account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  
  const movem = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movem.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${change(mov).toFixed(2)} USD</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


const calcDisplaySumaryMovements = (acc) => {
  const deposits =
    acc.movements
      .filter((mov) => mov > 0)
      .reduce((deposit, mov) => deposit + mov);
  labelSumIn.textContent = change(deposits).toFixed(2);
  const withdrawal = (!acc.movements.filter(mov => mov > 0)) ? 0 : acc.movements.filter((mov) => mov < 0).reduce((deposit, mov) => deposit + mov, 0);
  labelSumOut.textContent = change(Math.abs(withdrawal)).toFixed(2);
  const interest = acc.movements
    .filter((deposit) => deposit > 0)
    .map((mov) => mov * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((accInt, mov) => accInt + mov, 0);
  labelSumInterest.textContent = interest.toFixed(2);
  const ballance = (deposits + withdrawal).toFixed(2);
  acc.ballance = change(ballance).toFixed(2);
  labelBalance.textContent = `${acc.ballance} USD`;
};

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

  //generating the user when loging in
  // currentAccount = accounts.find(
  //   account => {
  //     accounts[0].createUserName.call(account);
  //     return account.username === inputLoginUsername.value;
  //   }
  // );
  currentKey = inputLoginUsername.value;
  currentAccount = JSON.parse(localStorage.getItem(currentKey))
  console.log(currentAccount)

  //validating the user's pin
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    //display UI container
    containerSignUp.style.display = "none";
    containerApp.style.opacity = "100%";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    updateUI(currentAccount);
  } else {
    console.log('invalid account')
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
    currentAccount.movements.push(-ammount * currency.changeUSDToEur());
    localStorage.setItem(currentKey, JSON.stringify(currentAccount))
    receiverAccount.movements.push(ammount * currency.changeUSDToEur());
    localStorage.setItem(receiverAccount.id, JSON.stringify(receiverAccount))

    //updating UI after transfer
    updateUI(currentAccount);
  } else {
    console.log('error')
  }
});

//request loan function - if the account has a deposit value that is at least 10% of the requested loan value
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const loanMinTax = 0.1; //10% - min percentage of deposit for the loan to be granted
  const requestLoan = Number(inputLoanAmount.value) * currency.changeUSDToEur();
  if (currentAccount.movements.some(mov => mov >= requestLoan * loanMinTax)) {
    currentAccount.movements.push(requestLoan)
    updateUI(currentAccount)
    localStorage.setItem(currentKey, JSON.stringify(currentAccount));

  } else {
    alert(`The value requested of $${requestLoan * currency.changeEurToUSD()} USD was denied`);
  }
  inputLoanAmount.blur()
  inputLoanAmount.value = "";

});

//function to add movement, wether it be deposit or withdrawal.
const withdrawalOrDeposit = value => {
  currentAccount.movements.push(value);
  updateUI(currentAccount);
  localStorage.setItem(currentKey, JSON.stringify(currentAccount))
}

//withdrawal function
btnWithdrawal.addEventListener('click', function(e) {
  e.preventDefault();
  
  const withdrawal = Number(-inputWithdrawal.value)
  console.log(withdrawal)
  console.log(Number(currentAccount.ballance))
  console.log(currentAccount.pin)
  console.log(Number(inputWithdrawalPin.value))
  if(withdrawal <= Number(currentAccount.ballance) && currentAccount.pin === Number(inputWithdrawalPin.value)){
    withdrawalOrDeposit(withdrawal);
  } else{
    console.log('withdrawal not allowerd')
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
    // const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // accounts.splice(index, 1);
    // console.log(accounts);
    localStorage.removeItem(currentAccount.id)
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
// --------- 1. Change currency using a button
// ------------ 1.1 Create a property 'movements' for both currencies (main currency and secondary currency)
// ------------ 1.2 Use a method to convert the movements of the main currency and generate the secondary currency movements
// ---------- 2. Create functions as variables to use as callback functions
// ------------ 2.1 Create a variable to the callback function 'deposit'
// ------------ 2.1 Create a variable to the callback function 'withdrawal'
