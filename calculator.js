let numbers = ["0","1","2","3","4","5","6","7","8","9","a","b","e","f","g","h","i","j","k","l","n","q","r","s","t","u","v","w","y","z"];
let operators = ["p","m","x","d","o","c"];


// Check whether input expression is valid
// Basic concept is that there are characters that should not come after certain characters
function valid(exp){
	for (let i=0; i<exp.length; i++){
		if (!(numbers.indexOf(exp[i])>=0 || operators.indexOf(exp[i])>=0)){
			return false;
		}
	}

	if (!(numbers.indexOf(exp[0])>=0 || ["m","o"].indexOf(exp[0])>=0)){
		return false;
	}

	if (!(numbers.indexOf(exp[exp.length-1])>=0 || exp[exp.length-1]=="c")){
		return false;
	}

	for (let i=0; i<exp.length-1; i++){
		if (numbers.indexOf(exp[i])>=0 && exp[i+1]=="o"){
			return false;
		} else if (["p","x","d"].indexOf(exp[i])>=0 && ["p","x","d","c"].indexOf(exp[i+1])>=0){
			return false;
		} else if (exp[i]=="m" && ["p","m","x","d","c"].indexOf(exp[i+1])>=0){
			return false;
		} else if (exp[i]=="o" && ["p","x","d","c"].indexOf(exp[i+1])>=0){
			return false;
		} else if (exp[i]=="c" && (exp[i+1]=="o" || numbers.indexOf(exp[i+1])>=0)){
			return false;
		}
	}

	let x = 0
	for (let i=0; i<exp.length; i++){
		if (x<0){
			return false;
		} else if (exp[i]=="o"){
			x+=1;
		} else if (exp[i]=="c"){
			x-=1;
		}
	}
	if (x!=0){
		return false;
	}

	return true;
}


// Main calculating function
// First, calculate the brackets from inner to outer
// Second, calculate multiplications and divisions
// Lastly, calculate additions and subtractions
function cal(exp){
	for (let i=0; i<exp.length; i++){
		if (exp[i]=="c"){
			for (let j=0; j<i; j++){
				if (exp[i-j-1]=="o"){
					return cal(exp.substring(0,i-j-1)+cal(exp.substring(i-j,i))+exp.substring(i+1));
				}
			}
		}
	}

	let num1 = "";
	let num2 = "";
	let start = 0;
	let end = 0;

	for (let i=0; i<exp.length; i++){
		if (["x","d"].indexOf(exp[i])>=0){
			for (let j=0; j<i; j++){
				if (exp[i-j-1]=="p"){
					start = i-j;
					num1 = exp.substring(i-j,i);
					break;
				} else if (exp[i-j-1]=="m"){
					if (i-j-1==0 || exp[i-j-2]=="p"){
						start = i-j-1;
						num1 = exp.substring(i-j-1,i);
					} else {
						start = i-j;
						num1 = exp.substring(i-j,i);
					}
					break;
				}
				start = 0;
				num1 = exp.substring(0,i);
			}

			for (let k=0; k<exp.length-i-1; k++){
				if (["p","m","x","d"].indexOf(exp[i+k+1])>=0 && k!=0){
					end = i+k+1;
					num2 = exp.substring(i+1,i+k+1);
					break;
				}
				end = i+k+2;
				num2 = exp.substring(i+1);
			}

			if (exp[i]=="x"){
				return cal(exp.substring(0,start) + multiply(num1,num2) + exp.substring(end));
			} else if (exp[i]=="d"){
				if (num2 == "0" || num2 == "m0"){
					return "#DIV/0!"
				}
				return cal(exp.substring(0,start) + divide(num1,num2) + exp.substring(end));
			} else{
				//cannot reach here
			}
		}
	}

	exp = exp.replace("pm","m");

	for (let i=0; i<exp.length; i++){
		if (["p","m"].indexOf(exp[i])>=0 && i!=0){
			num1 = exp.substring(0,i);
			for (let k=0; k<exp.length-i-1; k++){
				if (["p","m"].indexOf(exp[i+k+1])>=0 && k!=0){
					end = i+k+1;
					num2 = exp.substring(i+1,i+k+1);
					break;
				}
				end = i+k+2;
				num2 = exp.substring(i+1);
			}

			if (exp[i]=="p"){
				return cal(exp.substring(0,start) + plus(num1,num2) + exp.substring(end));
			} else if (exp[i]=="m"){
				return cal(exp.substring(0,start) + minus(num1,num2) + exp.substring(end));
			} else{
				//cannot reach here
			}
		}
	}

	while (true){
		if (exp[0] == "0" && exp.length!=1){
			exp = exp.substring(1);
		} else {
			break;
		}
	}
	return exp;
}


// Addition
// To calculate large numbers, calculate each character individually
// If carrying occurs, add 1 to the next place
function plus(x,y){
	if (x[0]=="m"){
		return minus(y,x.substring(1));
	}

	let num1 = (x.length >= y.length) ? x : y;
	let num2 = (x.length >= y.length) ? y : x;
	let result = "";

	for (let i=0; i<num1.length+1; i++){
		result = result+"0";
	}

	for (let i=0; i<num2.length; i++){
		let sum = numbers.indexOf(num1[num1.length-i-1]) + numbers.indexOf(num2[num2.length-i-1]) + numbers.indexOf(result[result.length-i-1]);
		let sum_str = "";
		while (sum>0){
			sum_str = numbers[parseInt(sum%30)] + sum_str;
			sum = parseInt(sum/30);
		}
		for (let j=0; j<sum_str.length; j++){
			result = result.substring(0,result.length-i-1-j) + sum_str[sum_str.length-j-1] + result.substring(result.length-i-j);
		}
	}

	for (let i=0; i<num1.length-num2.length; i++){
		let sum = numbers.indexOf(num1[num1.length-num2.length-i-1]) + numbers.indexOf(result[result.length-num2.length-i-1]);
		let sum_str = "";
		while (sum>0){
			sum_str = numbers[parseInt(sum%30)] + sum_str;
			sum = parseInt(sum/30);
		}
		for (let j=0; j<sum_str.length; j++){
			result = result.substring(0,result.length-num2.length-i-1-j) + sum_str[sum_str.length-j-1] + result.substring(result.length-num2.length-i-j);
		}
	}
	while (true){
		if (result[0] == "0" && result.length!=1){
			result = result.substring(1);
		} else {
			break;
		}
	}
	return result;
}


// Subtraction
// To calculate large numbers, calculate each character individually
// If borrowing is needed, subtract 1 from the next place
function minus(x,y){
	if (x[0]=="m"){
		return "m"+plus(x.substring(1),y);
	} else if (larger(y,x)){
		return "m"+minus(y,x);
	}

	let num1 = x;
	let num2 = y;
	let result = "";

	let borrow = false;
	for (let i=0; i<num2.length; i++){
		let sub = numbers.indexOf(num1[num1.length-i-1]) - numbers.indexOf(num2[num2.length-i-1]);
		if (borrow){
			sub-=1;
		}
		if (sub<0){
			borrow = true;
			sub+=30;
		} else {
			borrow = false;
		}
		result = numbers[sub] + result;
	}

	for(let i=0; i<num1.length-num2.length; i++){
		let sub = numbers.indexOf(num1[num1.length-num2.length-i-1]);
		if (borrow){
			sub-=1;
		}
		if (sub<0){
			borrow = true;
			sub+=30;
		} else {
			borrow = false;
		}
		result = numbers[sub] + result;
	}

	while (true){
		if (result[0] == "0" && result.length!=1){
			result = result.substring(1);
		} else {
			break;
		}
	}
	return result;
}


// Multiplication
// To calculate large numbers, calculate each character individually
// Use my plus function to add the result to the right place
function multiply(x,y){
	if (x[0]=="m" && y[0]!="m"){
		return "m"+multiply(x.substring(1),y);
	} else if (x[0]!="m" && y[0]=="m"){
		return "m"+multiply(x,y.substring(1));
	} else if (x[0]=="m" && y[0]=="m"){
		return multiply(x.substring(1),y.substring(1));
	}

	let num1 = (x.length >= y.length) ? x : y;
	let num2 = (x.length >= y.length) ? y : x;
	let result = "0";

	for (let i=0; i<num2.length; i++){
		for (let j=0; j<num1.length; j++){
			let mul = numbers.indexOf(num1[num1.length-j-1]) * numbers.indexOf(num2[num2.length-i-1]);
			
			let mul_str = "";
			while (mul>0){
				mul_str = numbers[parseInt(mul%30)] + mul_str;
				mul = parseInt(mul/30);
			}
			for (let k=0; k<i+j; k++){
				mul_str = mul_str + "0";
			}
			result = plus(mul_str, result);
		}
	}

	return result;
}


// Division
// To calculate large numbers, calculate each character individually
// Starting from the front, used for loop from 1 to 29 to find the divided number
// Continue until the denominator is larger than the numerator
function divide(x,y){
	let num1 = x;
	let num2 = y;
	let result = "";
	let neg = false;

	if (x[0]=="m" && y[0]!="m"){
		num1 = x.substring(1);
		neg = true;
	} else if (x[0]!="m" && y[0]=="m"){
		num2 = y.substring(1);
		neg = true;
	} else if (x[0]=="m" && y[0]=="m"){
		num1 = x.substring(1);
		num2 = y.substring(1);
	}

	if (larger(num2,num1)){
		return "0";
	}

	for (let i=num1.length-num2.length; i>=0; i--){
		for (let j=1; j<30; j++){
			if (larger(multiply(num2,numbers[j]),num1.substring(0,num1.length-i))){
				result = result + numbers[j-1];
				let temp = multiply(num2,numbers[j-1]);
				for (let k=0; k<i; k++){
					temp = temp + "0";
				}
				num1 = minus(num1,temp);
				break;
			} else if (j==29){
				if (larger(multiply(num2,"10"),num1.substring(0,num1.length-i))){
					result = result + "z";
					let temp = multiply(num2,"z");
					for (let k=0; k<i; k++){
						temp = temp + "0";
					}
					num1 = minus("num1",temp);
				} else{
					result = result + "0";
				}
			}
		}
	}

	if (neg){
		result = "m"+result;
	}
	return result;
}


// Function that checks whether x is larger than y
function larger(x,y){
	if (x.length>y.length){
		return true;
	} else if (y.length>x.length){
		return false;
	} else if (x.length == y.length){
		for (let i=0; i<x.length; i++){
			if (numbers.indexOf(x[i])>numbers.indexOf(y[i])){
				return true;
			} else if (numbers.indexOf(y[i])>numbers.indexOf(x[i])){
				return false;
			}
		}
	}
	return false;
}


// The main function
// Used console.log
function main(exp){
	if (!valid(exp)){
		console.log("not valid");
	} else{
		console.log(cal(exp));
	}
}