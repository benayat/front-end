const numbers = [1, -5, 666, 2, 400, 11];

numbers.sort((a, b) => a - b).reverse();
console.log(numbers);
numbers.sort((a, b) => a - b);
console.log(numbers);
