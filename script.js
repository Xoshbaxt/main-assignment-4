function clearDisplayText() {
    display.changeValue = "0";
    first_input.value = "";
    display_text.value = "0";
    sign.value = "plus";
    decimal_separator.pressed = false;
    operator.pressed = false;
    operator.name = "";
    operator.count = 0;
    Equal.isPressed = false;
}

function undo() {
    if (display.storedValue === "") return;
    if (display.storedValue.toString().charAt(display.storedValue.toString().length - 1) === '.') {
        decimal_separator.pressed = false;
    }
    if (display.storedValue.toString().length === 1) display.changeValue = "";
    else display.changeValue = display.storedValue.toString().substring(0, display.storedValue.toString().length - 1);
    displayResults(display.storedValue);
}

function isEqualPressingSafe() {
    if (display.storedValue !== "" && operator.count > 0) return true;
    else return false;
}

function add(number_1, number_2) {
    return number_1 + number_2;
}

function subtract(number_1, number_2) {
    return number_1 - number_2;
}

function multiply(number_1, number_2) {
    return number_1 * number_2;
}

function divide(number_1, number_2) {
    if (number_2 === 0) return zero_division_error;
    else return number_1 / number_2;
}

function displayResults(result) {
    display_text.value = result;
}

function calculatePercentage(value) {
    let float_value = parseFloat(value);
    let percentage_number =  float_value / 100;
    display.changeValue = percentage_number;
    displayResults(percentage_number);
    first_input.value = "";
}

function operate(operator, value_1, value_2) {
    let result;
    switch(operator) {
        case "addition":
            result = add(parseFloat(value_1), parseFloat(value_2));
            break;
        case "subtraction":
            result = subtract(parseFloat(value_1), parseFloat(value_2));
            break;
        case "multiplication":
            result = multiply(parseFloat(value_1), parseFloat(value_2));
            break;
        case "division":
            result = divide(parseFloat(value_1), parseFloat(value_2));
            break;
        default:
            result = "";                                
    }
    return result;
}

// setting operator name for keyboard operators 
function defineOperatorName(operator_value) {
    let operator_name;
    switch(operator_value) {
        case '+':
            operator_name = "addition";
            break;
        case '-':
            operator_name = "subtraction";
            break;
        case '*':
            operator_name = "multiplication";
            break;
        case '/':
            operator_name = "division";
            break;
        default:
            operator_name = "";  
            return;                  
    }
    doOperation(operator_name);
}

function doOperation(operator_name) {
    operator.pressed = true;
    let result = "";
    operator.count++;
    if (operator.name === "") operator.name = operator_name;
    if(first_input.value !== "" && first_input.value !== display.storedValue){ 
        result = operate(operator.name, first_input.value, display.storedValue);
    }
    if(result !== ""){
        if(result.toString().length > 12 && result.toString() !== zero_division_error) result = result.toPrecision(5);
        display.changeValue = result;
        displayResults(result);
    }
    operator.name = operator_name;
}

function doEqualOperation() {
    Equal.isPressed = true;
    let isSafe = isEqualPressingSafe();
    let result;
    if (isSafe) {
        if (first_input.value === "" && operator.count === 1) {
            result = operate(operator.name, display.storedValue, display.storedValue);
        } 
        else result = operate(operator.name, first_input.value, display.storedValue);
        if (result.toString().length > 12 && result.toString() !== zero_division_error) result =  result.toPrecision(5);
        display.changeValue = result;
        displayResults(result);
        operator.pressed = false;
    }
    first_input.value = display.storedValue;
}

function assignSignValue() {
    let display_data;
    if(display_text.value !== "0"){
        display_data = display_text.value;
        if(sign.value === "plus") {
            display.changeValue = "-" + display_data;
            sign.value = "minus";
        }
        else if(sign.value === "minus") {
            display.changeValue = display_data.substring(1);
            sign.value = "plus";
        } 
        displayResults(display.storedValue);
    }
}

// Keyboard input checking
function checkOtherKeyboardValues(key) {
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        if(key === '-' && display_text.selectionStart === 0) {
            assignSignValue();
            return;
        }
        decimal_separator.pressed = false;
        defineOperatorName(key);
        Equal.isPressed = false;
    } 
    else if (key === '=') {
        doEqualOperation();
        decimal_separator.pressed = false;
        Equal.isPressed = false;
    }    
    else if (key === '%') {
        let displayData = display_text.value;
        calculatePercentage(displayData);
    } 
    else if (key === '.') {
        if(!decimal_separator.pressed && !display_text.value.includes('.')){
            decimal_separator.pressed = true; 
            display.changeValue = display.storedValue + '.';
            displayResults(display.storedValue);
        }    
    }
    else if (key === 'Backspace') undo();
}

const decimal_separator = {pressed: false};
const first_input = {value: ""};
const sign = {value: "plus"};
const Equal = {isPressed:false};

const display = {
    display_value: "0",

    set changeValue(newValue) {
        this.display_value = newValue;
    },

    get storedValue() {
        return this.display_value;
    },
};

const operator = {
    pressed: false,
    name: "",
    count: 0
};

const zero_division_error = "Zero rolled away \u{1F631}";

const display_text = document.getElementById("display");

// Getting input from calculator
const number_inputs = document.querySelectorAll('.numbers');
number_inputs.forEach((number_input) => {
    number_input.addEventListener('click', (e) => {
        if (display.storedValue.toString().length < 20) {
            if(operator.pressed || Equal.isPressed) {
                first_input.value = display.storedValue;
                display.changeValue = "";
                displayResults(display.storedValue);
                operator.pressed = false;
                Equal.isPressed = false;
                decimal_separator.pressed = false; 
            }
            if (display.storedValue === "0" || operator.pressed) display.changeValue = e.target.value;
            else display.changeValue = display.storedValue + e.target.value;
            displayResults(display.storedValue);
        }
    });
});

const operators = document.querySelectorAll('.operators');
operators.forEach((operator_value) => {
    operator_value.addEventListener('click', (e) => {
        doOperation(e.target.name);
    })
});

const percentSign = document.querySelector('.percentage');
percentSign.addEventListener('click', () => {
    let displayData = display_text.value;
    calculatePercentage(displayData);
});

const decimalSeparator = document.querySelector('.decimal_separator');
decimalSeparator.addEventListener('click', (e) => {
    if(!decimal_separator.pressed) {
        display.changeValue = display.storedValue + e.target.value;
        displayResults(display.storedValue);
        decimal_separator.pressed = true;
    }    
});

// Getting input from keyboard
const input_value = document.getElementById("display");
input_value.addEventListener('keydown', (e) => {
    let allowed_inputs = /^[0-9]+$/;
    let allowed = allowed_inputs.test(e.key);
    //Check for valid input
    if(!allowed) e.preventDefault();
    else {
        if (operator.pressed && display.storedValue !== "0") {
            first_input.value = display.storedValue;
            display_text.value = "";
            display.changeValue = e.key;
            operator.pressed = false;
        } 
        else if (display.storedValue === "0") display.changeValue = e.key;
        else if (!operator.pressed && display.storedValue !== "0") display.changeValue = display.storedValue + e.key;
    }
    // check for other keyboard values
    checkOtherKeyboardValues(e.key); 
});
