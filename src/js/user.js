//buttons
const submitButton = document.querySelector('.form__btn---submit--signup');


//inputs
const inputFullName = [];
const inputFirstName = document.querySelector('.form__input--firstName');
const inputLastName = document.querySelector('.form__input--lastName');
const inputDeposit = document.querySelector('.form__deposit');
const inputPin = document.querySelector('.form__pin')

//containers
const containerShowUser = document.querySelector('.show__user')
const showUserInfo = document.querySelector('.show__user---container')
console.log(containerShowUser)

//array to store the users
const users = [];
const usersObject = {};

//Main class - creating the user
class User {
    interest = 1; //1%

    constructor(ownerName, mov, pin){
        this.createOwner(ownerName);
        this.pin = pin;
        this.movements = [];
        this.addMove(mov);
        this.createUser(ownerName)
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
}
//adding user to the Users Object in the localStorage
const addUserObject = acc => {
    usersObject[acc.id] = acc;
    const key = acc.id;
    const value = acc;
    localStorage.setItem(key, JSON.stringify(value))
    // const teste = JSON.parse(localStorage.getItem(key))
}
localStorage.clear();

//creating the user
let currentUser;
const createUser = (userFullName, depositValue, userPin) => {
    currentUser = new User(userFullName, depositValue, userPin)
    users.push(currentUser);

    addUserObject(currentUser);
}

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
            <td>${pin.slice(-1).padStart(pin.length, '*')}</td>
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
    createUser([inputFirstName.value, inputLastName.value], inputDeposit.value, inputPin.value);
    //clear input
    inputFirstName.blur()
    inputLastName.blur()
    inputDeposit.blur()
    inputPin.blur()
    inputFirstName.value = inputLastName.value = inputDeposit.value = inputPin.value = "";
    //showing information
    showUserInformation(currentUser.owner, currentUser.id, currentUser.pin, currentUser.movements[0])

})
// users.push(new User(['Helton', 'Oliveira'], 100, 1111));


//------ Add movement function
    // let currentAccount;
    // const addMov = transaction => {
    //         currentAccount.addMove(transaction)
    // }
// console.log(users)


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


// creating the logic to store the users in the localStorage

// console.log(usersObject)

// console.log(usersObject = {(currentAccount.id),  })