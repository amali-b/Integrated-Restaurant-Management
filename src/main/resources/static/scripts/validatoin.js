// define common validation function for dynamic element
const selectDynamicElementValidator = (element, object, property) => {
    const elementValue = element.value;
    const ob = window[object];

    //value not empty
    if (elementValue != "") {
        element.style.border = "2px solid green";
        ob[property] = JSON.parse(elementValue);
    } else {
        // value is empty
        element.style.border = "2px solic red";
        ob[property] = null;
    }
}

// define common validation function for dynamic element
const select2DynamicElementValidator = (element, object, property) => {
    const elementValue = element.value;
    const ob = window[object];

    //value not empty
    if (elementValue != "") {
        element.parentNode.children[2].children[0].children[0].style.border = "2px solid green";
        ob[property] = JSON.parse(elementValue);
    } else {
        // value is empty
        element.parentNode.children[2].children[0].children[0].style.border = "2px solic red";
        ob[property] = null;
    }
}

// txtValidator(this,'^[a-zA-Z0-9\\%]{6,20}[@][a-z]{4,10}[.][a-z]{2,3}$', 'employee', 'email') --> employee object eke email propery eka
const txtValidator = (elementId, pattern, object, property) => {
    const elementValue = elementId.value;
    const regPattern = new RegExp(pattern);
    ob = window[object];

    if (elementValue != "") {
        //value not empty
        if (regPattern.test(elementValue)) {
            // valid value
            //employee[email] = abc@gmail.com
            ob[property] = elementValue;
            elementId.style.border = "green 2px solid";
        } else {
            // invalid value
            ob[property] = null;
            elementId.style.border = "red 2px solid";
        }

    } else {
        ob[property] = null;
        // value is empty
        if (elementId.required) {
            elementId.style.border = "2px solid red";
        } else {
            elementId.style.border = "1px solid #ced4da";
        }
    }
}

const priceValidator = (elementId, object, property) => {
    const elementValue = elementId.value;
    const regPattern = new RegExp("^([1-9][0-9]{2,8})|([1-9][0-9]{2,8}[.][0-9]{2})$");
    ob = window[object];

    if (elementValue != "") {
        //value not empty
        if (regPattern.test(elementValue)) {
            // valid value
            //employee[email] = abc@gmail.com
            ob[property] = elementValue;
            elementId.style.border = "green 2px solid";
        } else {
            // invalid value
            ob[property] = null;
            elementId.style.border = "red 2px solid";
        }
    } else {
        ob[property] = null;
        // value is empty
        if (elementId.required) {
            elementId.style.border = "2px solid red";
        } else {
            elementId.style.border = "1px solid #ced4da";
        }
    }
}

const dateElementValidator = (elementId, object, property) => {
    const elementValue = elementId.value;
    ob = window[object];
    if (elementValue != "") {
        //value not empty
        elementId.style.border = "2px solid green";
        ob[property] = elementValue;
    } else {
        // value is empty
        elementId.style.border = "2px solid red";
        ob[property] = null;
    }
}

// fileValidator(imgEmployee, 'employee', 'employeeimage', 'imgPreview',  clearBtn, container);
// function for file/image validation
const fileValidator = (filEelement, object, property, previewElement, clearBtn, container) => {

    // Check if the input element is empty
    if (filEelement.value != "") {
        const file = filEelement.files[0];

        // Hover listeners (clean before adding to avoid duplicates)
        container.onmouseenter = () => {
            clearBtn.style.display = 'inline-block';
        };

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            // Set preview image
            previewElement.src = e.target.result;
            // Store base64 image in object[property]
            window[object][property] = btoa(e.target.result);
        };
        fileReader.readAsDataURL(file);
    }
}