//buttons
const submitButton = document.querySelector('.form__btn---submit--signup');


//inputs
const inputFullName = [];
const inputFirstName = document.querySelector('.form__input--firstName');
const inputLastName = document.querySelector('.form__input--lastName');
const inputDeposit = document.querySelector('.form__deposit');
const inputPin = document.querySelector('.form__pin');

//containers
const containerShowUser = document.querySelector('.show__user')
const showUserInfo = document.querySelector('.show__user---container')

//array to store the users
const users = [];
const usersObject = {};

//Main class - creating the user
class User {
    interestRate = 1; //1%

    constructor(ownerName, mov, pin){
        this.createOwner(ownerName);
        this.pin = pin;
        this.movements = [];
        this.movementsDates = [];
        this.addMove(mov);
        this.createUser(ownerName)
        this.addDate()
    }
    createOwner(ownerName) {
        this.owner = ownerName.join(" ");
    }
    createUser (ownerN){
        const uId = ownerN.map(char => char[0]).join("").toLowerCase();
        if (users.length === 0) {
            this.id = uId;
        } else {
            users.find(userId => userId.id !== uId ? this.id = uId : this.id = (`${uId}vb`));
        }
    }
    addMove(mov) {
        this.movements.push(mov)
    }
    addDate() {
        this.movementsDates.push(new Date())
    }
}
//adding user to the Users Object in the localStorage
const addUserObject = acc => {
    usersObject[acc.id] = acc;
    const key = acc.id;
    const value = acc;
    localStorage.setItem(key, JSON.stringify(value))
    // const teste = JSON.parse(localStorage.getItem(key))
}
// localStorage.clear();

//creating the user
let currentUser;
const createUser = (userFullName, depositValue, userPin) => {
    currentUser = new User(userFullName, depositValue, userPin)
    users.push(currentUser);

    addUserObject(currentUser);
}

//users for test
const alphaUser = new User(['Alpha','Alpha'], 500, 8888);
const omegaUser = new User(['Omega','Omega'], 1000, 9999);
alphaUser.movements.push(100, -200, 500);
alphaUser.movementsDates.push(new Date('December 2, 2022'), new Date('November 18, 2022'), new Date('September 3, 2022'),);
console.log(alphaUser)
addUserObject(alphaUser);
addUserObject(omegaUser);

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
            <td>${String(pin).slice(-1).padStart(4, '*')}</td>
        </tr>
        <tr>
            <td>Initial Deposit</td>
            <td>${deposit}</td>
        </tr>
        </table>
    <div>
    `
    containerShowUser.insertAdjacentHTML('afterbegin', userInfo)
}
//submit button
submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    //creating user
    createUser([inputFirstName.value, inputLastName.value], Number(inputDeposit.value), Number(inputPin.value));
    //clear input
    inputFirstName.blur()
    inputLastName.blur()
    inputDeposit.blur()
    inputPin.blur()
    inputFirstName.value = inputLastName.value = inputDeposit.value = inputPin.value = "";
    //showing information
    showUserInformation(currentUser.owner, currentUser.id, currentUser.pin, currentUser.movements[0])

})

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
