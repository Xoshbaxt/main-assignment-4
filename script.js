function clearDisplayText() {
    display.changeValue = "0";
    first_input.changeFirstInput = "";
    display_text.value = "0";
    sign.changeSignValue = "plus";
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
    if ((first_input.value !== "") && (display.storedValue !== first_input.value) && (operator.count > 0)) return true;
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
    if (number_2 === 0) return "Zero rolled away \u{1F631}";
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
    first_input.changeFirstInput = "";
}

function operate(operator, value_1, value_2) {
    console.log(value_1);
    console.log(value_2);
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
    if((first_input.value !== "") && (first_input.value !== display.storedValue)){ 
        result = operate(operator.name, first_input.value, display.storedValue);
    }
    else if ((operator.count > 1) && (!Equal.isPressed)) {
        result = operate(operator.name, display.storedValue, display.storedValue);
    }
    if(result !== ""){
        if(result.toString().length > 12) result = result.toPrecision(5);
        display.changeValue = result;
        displayResults(result);
    }
    operator.name = operator_name;
}

function doEqualOperation() {
    Equal.isPressed = true;
    let isSafe = isEqualPressingSafe();
    if (isSafe) {
        let result = operate(operator.name, first_input.value, display.storedValue);
        if (result.toString().length > 12) result =  result.toPrecision(5);
        display.changeValue = result;
        displayResults(result);
        operator.pressed = false;
    }
    first_input.changeFirstInput = display.storedValue;
}

function assignSignValue() {
    let display_data;
    if(display_text.value !== "0"){
        if(sign.signData === "plus") {
            display_data = display_text.value;
            display.changeValue = "-" + display_data;
            displayResults(display.storedValue);
            sign.changeSignValue = "minus";
        }
        else if(sign.signData === "minus") {
            display_data = display_text.value;
            display.changeValue = display_data.substring(1);
            displayResults(display.storedValue);
            sign.changeSignValue = "plus";
        } 
    }
}

function checkOtherKeyboardValues(key) {
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        if(key === '-' && display_text.selectionStart === 0) {
            assignSignValue();
            return;
        }
        decimal_separator.pressed = false;
        defineOperatorName(key);
        Equal.isPressed = false;
        console.log(display.storedValue);
        console.log(first_input.value);
    } 
    else if (key === '=') {
        doEqualOperation();
        decimal_separator.pressed = false;
        Equal.pressed = false;
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

const equal = document.querySelector('.equal');
equal.addEventListener('click', () => {
    doEqualOperation();
})

const display_text = document.getElementById("display");

const display = {
    display_value: "0",

    set changeValue(newValue) {
        this.display_value = newValue;
    },

    get storedValue() {
        return this.display_value;
    },
};

const first_input = {
    value_of_first_input: "",

    set changeFirstInput(newValue) {
        this.value_of_first_input = newValue;
    },

    get value() {
        return this.value_of_first_input;
    }
}

const sign = {
    sign_value: "plus",

    set changeSignValue(newValue) {
        this.sign_value = newValue;
    },

    get signData() {
        return this.sign_value;
    }
};

const number_inputs = document.querySelectorAll('.numbers');
number_inputs.forEach((number_input) => {
    number_input.addEventListener('click', (e) => {
        if (display.storedValue.toString().length < 20) {
            if(operator.pressed || Equal.isPressed) {
                first_input.changeFirstInput = display.storedValue;
                display.changeValue = "";
                displayResults(display.storedValue);
                operator.pressed = false;
                Equal.isPressed = false;
                decimal_separator.pressed = false; 
            }
            if(decimal_separator.pressed) {
                display.changeValue = display.storedValue + e.target.value;
                displayResults(display.storedValue);
            }
            else if (display.storedValue === "0") {
                display.changeValue = e.target.value;
                displayResults(display.storedValue);
            }
            else if (operator.pressed) {
                display.changeValue = e.target.value;
                displayResults(display.storedValue);
            }
            else {
                display.changeValue = display.storedValue + e.target.value;
                displayResults(display.storedValue);
            }
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

const signValue = document.querySelector('.sign');
signValue.addEventListener('click', () => {
    assignSignValue();
});

const clearAll = document.querySelector('.clear');
clearAll.addEventListener('click', clearDisplayText);

const backspace = document.querySelector('.backspace');
backspace.addEventListener('click', undo);

const input_value = document.getElementById("display");
input_value.addEventListener('keydown', (e) => {
    let allowed_inputs = /^[0-9]+$/;
    let allowed = allowed_inputs.test(e.key);
    //Check for valid input
    if(!allowed) e.preventDefault();
    else {
        if (operator.pressed && display.storedValue !== "0") {
            first_input.changeFirstInput = display.storedValue;
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

const operator = {
    pressed: false,
    name: "",
    count: 0
};

const Equal = {isPressed:false};
