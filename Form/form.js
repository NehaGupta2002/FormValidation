const loginBtn = document.querySelector("#loginBtn");
        const nameInput = document.querySelector("#name");
        const passwordInput = document.querySelector("#password");
        const addControlsDiv = document.querySelector("#addControls");
        const dataDiv = document.querySelector("#data");
        const resultDiv = document.querySelector("#result");
        const loginFormDiv = document.querySelector("#loginForm");

        let submitButton = null;
        let hasSubmittedFormSetup = false;

        loginBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const password = passwordInput.value.trim();

            if (name === "" || password === "") {
                alert("Please enter both Name and Password");
                return;
            }

            loginFormDiv.style.display = "none";
            addControlsDiv.style.display = "block";
            dataDiv.style.display = "block";
        });

        const fieldType = document.querySelector("#fieldType");
        const add = document.querySelector("#add");

        add.addEventListener('click', () => {
            if (hasSubmittedFormSetup) {
                alert("You cannot add more inputs after submitting the form.");
                return;
            }
        
            const selectedType = fieldType.value;
        
            // If no valid field type is selected, show an alert and prevent further execution
            if (selectedType === "") {
                alert("Please select a field type.");
                return;
            }
        
            let inputField, labelBtn;
        
            // If "submit" is selected, handle form submission setup
            if (selectedType === 'submit') {
                handleFormSubmitSetup();
                return;
            }
        
            // Create input field based on selected type
            inputField = document.createElement("input");
            inputField.type = selectedType;
        
            // Create additional input for label
            const additionalInput = document.createElement("input");
            additionalInput.type = "text";
            additionalInput.placeholder = "Enter label";
        
            // Create "Set Label" button
            labelBtn = document.createElement("button");
            labelBtn.textContent = "Set Label";
        
            // Event listener for setting the label
            labelBtn.addEventListener("click", () => {
                const labelText = additionalInput.value.trim(); // Get trimmed label text
                if (labelText !== "") {
                    const label = document.createElement("label");
                    label.textContent = `${labelText}: `;
                    const fieldContainer = document.createElement("div");
                    fieldContainer.classList.add("field-container");
        
                    // Handle radio and checkbox differently by adding options
                    if (selectedType === "radio" || selectedType === "checkbox") {
                        fieldContainer.appendChild(label);
                        addOptions(labelText, selectedType, fieldContainer);
                    } else {
                        // For normal inputs, just append the label and input
                        fieldContainer.appendChild(label);
                        fieldContainer.appendChild(inputField);
                    }
        
                    // Add a remove button to each field
                    fieldContainer.appendChild(createRemoveButton(fieldContainer));
        
                    // Add the field container to the dataDiv
                    dataDiv.appendChild(fieldContainer);
        
                    // Remove the additional input and the "Set Label" button
                    additionalInput.remove();
                    labelBtn.remove();
        
                    // Move the submit button to the end
                    moveSubmitButtonToEnd();
                } else {
                    alert("Please enter a valid label text."); // Validate label input
                }
            });
        
            // Append the label input and "Set Label" button to the dataDiv
            dataDiv.appendChild(additionalInput);
            dataDiv.appendChild(labelBtn);
            dataDiv.appendChild(document.createElement("br"));
        });
        

        // Function to add options for radio/checkbox types
        function addOptions(labelText, type, fieldContainer) {
            const optionInput = document.createElement("input");
            optionInput.type = "text";
            optionInput.placeholder = `Enter ${type} option`;

            const addOptionBtn = document.createElement("button");
            addOptionBtn.textContent = `Add ${type} option`;

            // Event listener to add radio/checkbox options
            addOptionBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const optionValue = optionInput.value.trim();
                if (optionValue === "") {
                    alert("Please enter a valid option.");
                    return;
                }

                const optionField = document.createElement("input");
                optionField.type = type;
                optionField.name = labelText; // Group by the label name
                optionField.value = optionValue;

                const optionLabel = document.createElement("label");
                optionLabel.textContent = optionValue;

                const optionContainer = document.createElement("div");
                optionContainer.classList.add("option-group");

                optionContainer.appendChild(optionField);
                optionContainer.appendChild(optionLabel);
                optionContainer.appendChild(createRemoveButton(optionContainer));

                // Add the option container to the fieldContainer
                fieldContainer.appendChild(optionContainer);

                // Clear the input for adding new options
                optionInput.value = "";

                // Move the submit button to the end
                moveSubmitButtonToEnd();
            });

            // Append option input and button to fieldContainer
            fieldContainer.appendChild(optionInput);
            fieldContainer.appendChild(addOptionBtn);
        }

        // Function to create a remove button for each added field or option
        function createRemoveButton(parentElement) {
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.classList.add("remove-btn");
            removeBtn.addEventListener("click", () => {
                parentElement.remove();
                moveSubmitButtonToEnd(); // Update submit button position after removal
            });
            return removeBtn;
        }

        // Function to move the submit button to the end of the dataDiv
        function moveSubmitButtonToEnd() {
            if (submitButton) {
                submitButton.remove(); // Remove the old submit button
            }
            submitButton = document.createElement("button");
            submitButton.textContent = "Submit";
            submitButton.style.display = "block";
            submitButton.style.marginTop = "20px";
            submitButton.addEventListener("click", handleSubmit);
            dataDiv.appendChild(submitButton); // Re-add submit button at the end
        }

        function moveSubmitButtonToEnd() {
            if (submitButton) {
                submitButton.remove();
            }
            submitButton = document.createElement("button");
            submitButton.textContent = "Submit";
            submitButton.style.display = "block";
            submitButton.style.marginTop = "20px";
            submitButton.addEventListener("click", handleSubmit);
            dataDiv.appendChild(submitButton);  // Ensure it always appends at the end
        }


        function handleSubmit() {
            const inputs = dataDiv.querySelectorAll("input");
            let result = "<h3>Result:</h3><ul>";

            inputs.forEach(input => {
                if (input.type === "radio" || input.type === "checkbox") {
                    if (input.checked) {
                        result += `<li>${input.value}</li>`;
                    }
                } else if (input.type === "text") {
                    const label = input.previousSibling.textContent || input.closest('.field-container').querySelector('label').textContent;
                    result += `<li>${label} ${input.value}</li>`;
                } else if (input.type !== "submit") {
                    const label = input.previousSibling.textContent || input.closest('.field-container').querySelector('label').textContent;
                    result += `<li>${label}: ${input.value}</li>`;
                }
            });

            result += "</ul>";
            resultDiv.innerHTML = result;
            resultDiv.style.display = "block"; // Show result

            // Hide other sections
            addControlsDiv.style.display = "none";
            dataDiv.style.display = "none";
        }

        function handleFormSubmitSetup() {
            // Disable adding more fields
            hasSubmittedFormSetup = true;

            // Remove all buttons except submit
            const buttons = document.querySelectorAll("button");
            buttons.forEach(btn => {
                if (btn !== submitButton) {
                    btn.remove();
                }
            });

            // Disable fieldType input
            fieldType.disabled = true;
        }