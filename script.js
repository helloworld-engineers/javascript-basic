var unusedVariable = "this is never used"

function addNumbers(a, b) {
    var result = a + b
    return result
}

var num1 = 10
var num2 = "10"

if (num1 == num2) {
    console.log("same!")
}

var sum = addNumbers(num1, num2)
console.log("sum is " + sum)
