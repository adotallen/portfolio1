function calculate() {
            // Clear previous errors
            document.getElementById("error1").textContent = "";
            document.getElementById("error2").textContent = "";
            document.getElementById("errorOp").textContent = "";
            document.getElementById("result").textContent = "";

            const operand1 = document.getElementById("operand1").value.trim();
            const operand2 = document.getElementById("operand2").value.trim();
            const operator = document.querySelector('input[name="operator"]:checked');

            let hasError = false;

            if (operand1 === "") {
                document.getElementById("error1").textContent = "Operand 1 is Required";
                hasError = true;
            }

            if (!operator) {
                document.getElementById("errorOp").textContent = "Operator is Required";
                hasError = true;
            }

            if (operand2 === "") {
                document.getElementById("error2").textContent = "Operand 2 is Required";
                hasError = true;
            }

            if (hasError) return false;

            const num1 = parseFloat(operand1);
            const num2 = parseFloat(operand2);
            let result;

            switch (operator.value) {
                case "+":
                    result = num1 + num2;
                    break;
                case "-":
                    result = num1 - num2;
                    break;
                case "*":
                    result = num1 * num2;
                    break;
                case "/":
                    if (num2 === 0) {
                        result = "Cannot divide by zero";
                    } else {
                        result = num1 / num2;
                    }
                    break;
            }

            document.getElementById("result").textContent = result;
            return false; // Prevent form submission
        }

        function clearForm() {
            document.getElementById("calcForm").reset();
            document.getElementById("result").textContent = "";
            document.getElementById("error1").textContent = "";
            document.getElementById("error2").textContent = "";
            document.getElementById("errorOp").textContent = "";
        }