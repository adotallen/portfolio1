function calculate(){
    "use strict"; 

    document.getElementById("Operand1Error").innerHTML = ""; 
    document.getElementById("Operand2Error").innerHTML = ""; 
    document.getElementById("OperatorError").innerHTML = ""; 
    document.getElementById("Result").innerHTML = ""; 

    let errorflag= false; 

    let operand1 = document.getElementById("Operand1").value; 

    if(operand1 == ""){
        document.getElementById("Operand1Error").innerHTML = "Operand 1 is required"; 
        errorflag = true; 
    }

    if(isNaN(operand1)) {
        document.getElementById("Operand1Error").innerHTML = "Operand 1 should be a floating number";
        errorflag = true; 
    }

    let operand2 = document.getElementById("Operand2").value; 

    if(operand2 == ""){
        document.getElementById("Operand2Error").innerHTML = "Operand 2 is required"; 
        errorflag = true; 

    }

    if(isNaN(operand2)) {
        document.getElementById("Operand2Error").innerHTML = "Operand 2 must be a floating number"; 
        errorflag = true; 
    }

    if(!document.getElementById("AddOperator").checked &&
        !document.getElementById("SubtractOperator").checked &&
        !document.getElementById("MultiplyOperator").checked &&
        !document.getElementById("DivideOperator").checked) {
            document.getElementById("OperatorError").innerHTML = "Operator is required"; 
            errorflag = true; 
        }

    if(!errorflag) {

        let operand1fp = parseFloat (operand1); 
        let operand2fp = parseFloat (operand2); 


        let operator; 
        if (document.getElementById("AddOperator").checked) {
            operator = document.getElementById("AddOperator").value; 
        }
        if (document.getElementById("SubtractOperator").checked) {
            operator = document.getElementById("SubtractOperator").value; 
        }
        if (document.getElementById("MultiplyOperator").checked) {
            operator = document.getElementById("MultiplyOperator").value; 
        }
        if (document.getElementById("DivideOperator").checked) {
            operator = document.getElementById("DivideOperator").value; 
        }

        let result; 

        if (operator == "Add") {
            result = operand1fp+operand2fp; 
        }

        if (operator == "Minus") {
            result = operand1fp-operand2fp
        }

        if (operator == "Multiply") {
            result = operand1fp * operand2fp
        }

        if (operator == "Divide") {
            result = operand1fp/operand2fp
        }

        document.getElementById("Result").innerHTML = result.toString(); 

}

}

function clearform() {

    document.getElementById("Operand1").value = ""; 
    document.getElementById("Operand2").value = ""; 
    document.getElementById("Operand1Error").innerHTML = ""; 
    document.getElementById("Operand2Error").innerHTML = ""; 
    document.getElementById("AddOperator").checked = false; 
    document.getElementById("SubtractOperator").checked = false; 
    document.getElementById("MultiplyOperator").checked = false; 
    document.getElementById("DivideOperator").checked = false; 
    document.getElementById("OperatorError").innerHTML = ""; 
    document.getElementById("Result").innerHTML = ""; 

}

