/*
 A wrapper class that will be used to interact with the browser's localstorage. 
 The class will try to retrieve data from the browser's storage. In the event there is nothing,
 it will set the storage with a default object looking like this:
 {
    accounts:[]
 }

 The key for this object will be vector_bank. The wrapper wil also set the local storage when new users are created.


*/
class LocalStorageWrapper {
  static storage = this.#getStorage();
  static users = this.storage.accounts; // Object of Users
  static #getStorage() {
    const clientStorage = localStorage.getItem("vectorBank");
    if (clientStorage == null) {
      this.storage = {
        accounts: [],
      };
      return this.#setLocalstorage();
    } else {
      return JSON.parse(clientStorage);
    }
  }
  static #setLocalstorage() {
    localStorage.setItem("vectorBank", JSON.stringify(this.storage));
    return this.storage;
  }
  static pushUser(userObj) {
    this.storage.accounts.push(userObj);
    this.#setLocalstorage();
  }
}

/*
A wrapper class for creating new users/accounts. The class has a private property called "users". This property will contain the array of users that are stored in the client's localstorage. 

Upon creating a new users, the class will assign it a new id through the `createOwner()` function.
Each instance of the user class will have an `addMove` function. This function is for future functionality to 
add additional transaction history. 
*/
class User {
  interestRate = 1; //1%
  id;
  owner;
  #users = LocalStorageWrapper.users; //users[]
  constructor(ownerName, mov, pin) {
    this.#createOwner(ownerName);
    this.pin = pin;
    this.movements = [];
    this.addMove(mov);
    this.#createUser(ownerName);
  }
  #createOwner(ownerName) {
    this.owner = ownerName.join(" ");
  }
  #createUser(ownerN) {
    const uId = ownerN
      .map((char) => char[0])
      .join("")
      .toLowerCase();
    if (this.#users.length === 0) {
      this.id = uId;
    } else {
      const newUser = this.#users.find((userId) =>
        userId.id !== uId ? (this.id = uId) : (this.id = `${uId}vb`)
      );
    }
  }
  addMove(mov) {
    this.movements.push(mov);
  }

}

const submitButton = document.querySelector(".form__btn---submit--signup");

//inputs
const inputFullName = [];
const inputFirstName = document.querySelector(".form__input--firstName");
const inputLastName = document.querySelector(".form__input--lastName");
const inputDeposit = document.querySelector(".form__deposit");
const inputPin = document.querySelector(".form__pin");

//containers
const containerShowUser = document.querySelector(".show__user");
const showUserInfo = document.querySelector(".show__user---container");
/*
As soon as the window is done loading, this event listener will retrieve any users from the browser's localstorage, and then render them onto the page. 

*/
window.onload = () => {
  if (LocalStorageWrapper.users) {
    const { users } = LocalStorageWrapper;
    users.forEach((user) => {
      showUserInformation(user.owner, user.id, user.pin, user.movements[0]);
    });
  }
};
const showUserInformation = (owner, id, pin, deposit) => {
  const userInfo = `
    <div class="show__user--container">
        <h3>User Information</h3>
        <table>
        <tr>
            <td>Name</td>
            <td>${owner}</td> 
        </tr>
        <tr>
            <td>User</td>
            <td>${id}</td> 
        </tr>
        <tr>
            <td>User pin</td>
            <td>${String(pin).slice(-1).padStart(4, "*")}</td>
        </tr>
        <tr>
            <td>Initial Deposit</td>
            <td>${deposit}</td>
        </tr>
        </table>
    <div>
    `;
  containerShowUser.insertAdjacentHTML("afterbegin", userInfo);
};

//submit button

submitButton.addEventListener("click", function (e) {
  e.preventDefault();

  const newUser = new User(
    [inputFirstName.value, inputLastName.value],
    Number(inputDeposit.value),
    Number(inputPin.value)
  );

  LocalStorageWrapper.pushUser(newUser);

  //clear input
  inputFirstName.blur();
  inputLastName.blur();
  inputDeposit.blur();
  inputPin.blur();
  inputFirstName.value =
    inputLastName.value =
    inputDeposit.value =
    inputPin.value =
      "";
  //showing information
  showUserInformation(
    newUser.owner,
    newUser.id,
    newUser.pin,
    newUser.movements[0]
  );
});

// --------- 0. Create a Sign Up page;
// --------- 1. Get the user name from the inputs (name, lastName) of the Sign Up page;
// ------------ 1.1 Store the 'name' and 'lastName' in a array;
// --------- 2. Get the user pin from the input (pin)
// ------------ 2.1 Store the pin in a variable
// --------- 3. Ask the user for a initial deposit
// ------------ 3.1 Store the deposit value in a variable
// --------- 4. Send the NAME (array), the DEPOSIT and the PIN as argument to CREATE the NEW USER
//create a DEPOSIT function
// --------- 5. Send the new user to the object to be stored in the localStorage
// --------- 6. Create a function to implement Dates on the movements
// ------------ 6.1 Show the current day for movements on the current day
// ------------ 6.2 For movements a day earlier, show 'yesterday' (string)
// ------------ 6.2 For days past longer than 1 day, show 'n days ago'