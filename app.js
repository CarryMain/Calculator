const display = document.querySelector('#display');
const btnRes = document.querySelector('#btnRes');
const btnDel = document.querySelector('#btnDel');

const operators = {
  butPlus: "+",
  butMinus: "-",
  butMultiply: "*",
  butShare: "/",
  butPoint: "."
};

document.querySelectorAll(".buttons-container button").forEach((button) => {
  const btnId = button.id;

    if (btnId.startsWith("but") && btnId.length > 3) {
        const lastCharacter = btnId.slice(-1);

    if ("0123456789".includes(lastCharacter)) {
        button.addEventListener("click", () => {
             display.textContent += lastCharacter;
      });
    }
    else if (Object.keys(operators).includes(btnId)) {

        button.addEventListener('click', () => {
            display.textContent += operators[btnId];
      });
    }
  }
});

const btnEqually = document.querySelector('#butEqually');

btnEqually.addEventListener('click', () => {
  try {
    display.textContent = calculate(display.textContent);
  }
  catch (error) {
    display.textContent = "error";
  }
});

btnRes.addEventListener("click", () => {
  display.textContent = "";
});

btnDel.addEventListener("click", () => {
  const displayValue = display.textContent;
  display.textContent = displayValue.slice(0, -1);
});

function calculate(expression) {
    let [tokens, stack] = tokenize(expression);
    let postfix = toPostfix(tokens, stack);
    return evaluate(postfix, stack);
  } 
  function tokenize(expression) {
    let tokens = expression.match(/\d+\.\d+|\d+|\+|\-|\*|\/|\(|\)/g);
    let stack = [];
    return [tokens, stack];
  }
  function toPostfix(tokens, stack) {
    let postfix = [];
  
    tokens.forEach(token => {
      if (!isNaN(token)) {
        postfix.push(parseFloat(token));
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        while (stack.length > 0 && stack[stack.length - 1] !== "(") {
          postfix.push(stack.pop());
        }
        stack.pop();
      } else {
        while (stack.length > 0 && precedence(token) <= precedence(stack[stack.length - 1])) {
          postfix.push(stack.pop());
        }
        stack.push(token);
      }
    });
  
    while (stack.length > 0) {
      postfix.push(stack.pop());
    }
  
    return postfix;
  }
  function precedence(token) {
    switch (token) {
      case "+":
      case "-":
        return 1;
      case "*":
      case "/":
        return 2;
      default:
        return 0;
    }
  }
  function evaluate(postfix, stack) {
    postfix.forEach(token => {
      if (!isNaN(token)) {
        stack.push(token);
      } else {
        let b = stack.pop();
        let a = stack.pop();
        switch (token) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
        }
      }
    });
    return stack[0];
  }
