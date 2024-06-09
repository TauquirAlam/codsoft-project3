let expression = '';
let result = '';

function insertDigit(digit) {
  expression += digit;
  updateDisplay();
}

function insertOperator(operator) {
  expression += operator;
  updateDisplay();
}

function clearDisplay() {
  expression = '';
  result = '';
  updateDisplay();
}

function deleteDigit() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate(operation) {
  if (operation === '=') {
    try {
      const tokens = tokenizeExpression(expression);
      result = evaluateExpression(tokens);
      expression = result.toString();
      updateDisplay();
    } catch (error) {
      result = 'Error';
      updateDisplay();
    }
  } else if (operation === 'sqrt') {
    try {
      result = Math.sqrt(parseFloat(expression));
      expression = result.toString();
      updateDisplay();
    } catch (error) {
      result = 'Error';
      updateDisplay();
    }
  }
}

function tokenizeExpression(exp) {
  const regex = /(\d+\.?\d*)|([+\-*/%\^])/g;
  return exp.match(regex);
}

function evaluateExpression(tokens) {
  const outputQueue = [];
  const operatorStack = [];
  const operators = {
    '+': { precedence: 2, associativity: 'L' },
    '-': { precedence: 2, associativity: 'L' },
    '*': { precedence: 3, associativity: 'L' },
    '/': { precedence: 3, associativity: 'L' },
    '%': { precedence: 3, associativity: 'L' },
    '^': { precedence: 4, associativity: 'R' },
  };

  tokens.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(parseFloat(token));
    } else if (token in operators) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] in operators &&
        (
          (operators[token].associativity === 'L' && operators[token].precedence <= operators[operatorStack[operatorStack.length - 1]].precedence) ||
          (operators[token].associativity === 'R' && operators[token].precedence < operators[operatorStack[operatorStack.length - 1]].precedence)
        )
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }
  });

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  const stack = [];

  outputQueue.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
        case '%': stack.push(a % b); break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  });

  return stack[0];
}

function updateDisplay() {
  document.getElementById('result').value = expression || result;
}