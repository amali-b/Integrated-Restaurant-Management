//define function for active tablebody row
const activeTableRow = (tBodyId, rowIndex, color) => {

    for (const element of tBodyId.children) {
        element.removeAttribute("style");
    }
    tBodyId.children[parseInt(rowIndex)].style.backgroundColor = color;
}

// define function for generate colors
function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//define function for dynamic dropdown element
const fillDropdown = (parentId, message, datalist, property) => {
    // clear existing static values 
    parentId.innerHTML = "";
    if (message != "") {
        // create selected option element for show in the dropdown
        let optionMSG = document.createElement("option");
        optionMSG.innerText = message;
        optionMSG.selected = "selected";
        optionMSG.value = "";
        optionMSG.disabled = "disabled";
        parentId.appendChild(optionMSG);
    }

    datalist.forEach((dataOb) => {
        // create option element
        let option = document.createElement("option");
        //value attribute eke format eka string wenna ona nisa json string welata convert krenewa.
        option.value = JSON.stringify(dataOb);
        //submit kraddi javascript object bawata convert kranna one // dynamic eken gnna one object string one na.. Static welata string hodai..
        option.innerText = dataOb[property];
        parentId.appendChild(option)
    });
}

//define function for dynamic dropdown element with two properties including nested properties
const fillDropdownTwo = (parentId, message, datalist, property1, property2) => {
    // clear existing static values 
    parentId.innerHTML = "";
    if (message != "") {
        // create selected option element for show in the dropdown
        let optionMSG = document.createElement("option");
        optionMSG.innerText = message;
        optionMSG.selected = "selected";
        optionMSG.value = "";
        optionMSG.disabled = "disabled";
        parentId.appendChild(optionMSG);
    }

    datalist.forEach((dataOb) => {
        // create option element
        let option = document.createElement("option");
        //value attribute eke format eka string wenna ona nisa json string welata convert krenewa.
        option.value = JSON.stringify(dataOb);

        // Access nested property
        const value1 = dataOb[property1];
        // Handle nested property like "unittype_id.name"
        let value2 = "";
        // check if string contains a (.)dot 
        if (property2.includes(".")) {
            let parts = property2.split(".");
            // start from full object
            value2 = dataOb;
            for (let part of parts) {
                //  If value2 is a valid object 
                /* if (value2) {
                    value2 = value2[part];
                } else {
                    value2 = "";
                } */
                // uda thyena code ekama short krela lyela thyenne
                value2 = value2 ? value2[part] : "";
            }
        } else {
            value2 = dataOb[property2];
        }

        //submit kraddi javascript object bawata convert kranna one // dynamic eken gnna one object string one na.. Static welata string hodai..
        option.innerText = value1 + " ( " + value2 + " ) ";
        parentId.appendChild(option)
    });
}

/* const fillCheckbox = () =>{
    parentId.innerText = "";
} */

//call fill data into table
fillReportTable = (tBodyId, datalist, columnList) => {
    tBodyId.innerHTML = "";

    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);

        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            if (columnOb.dataType == "string") {
                //dataOb kyela datalist eke eka object ekak aran ekata property eke nama dila access krenewa.. [columnOb.property] me wdyta dala thyenne string ekaka dataOb.property wdyt gnna ba.
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            if (columnOb.dataType == "decimal") {
                td.innerHTML = dataOb[columnOb.property];
            }
            tr.appendChild(td);
        });
        tBodyId.appendChild(tr);
    });
}

// Define function for fill data in to table
//table ekema modify column eke buttons danewa
const fillTableOne = (tBodyId, datalist, columnList, editFunction, deleteFunction, printFunction, buttonVisibility = true) => {

    tBodyId.innerHTML = "";

    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);

        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            if (columnOb.dataType == "string") {
                //dataOb kyela datalist eke eka object ekak aran ekata property eke nama dila access krenewa.. [columnOb.property] me wdyta dala thyenne string ekaka dataOb.property wdyt gnna ba.
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            tr.appendChild(td);
        });

        let tdButtons = document.createElement("td");

        let editButton = document.createElement("button");
        editButton.className = "btn btn-outline-warning fw-bold me-2"
        editButton.innerHTML = "<i class='fa-solid fa-clock-rotate-left icon'></i><br> Update";
        // editButton.innerText = "Edit";
        tdButtons.appendChild(editButton);
        editButton.onclick = () => {
            console.log("edit");
            editFunction(dataOb, index);
        }

        let printButton = document.createElement("button");
        printButton.className = "btn btn-outline-success fw-bold me-2"
        printButton.innerHTML = "<i class='fa fa-print'></i><br> Print";
        // printButton.innerText = "Print";
        tdButtons.appendChild(printButton);
        printButton.onclick = () => {
            console.log("Print");
            printFunction(dataOb, index);
        }

        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-outline-danger fw-bold me-2"
        deleteButton.innerHTML = "<i class='fa fa-trash'></i><br> Delete";
        // deleteButton.innerText = "Delete";
        tdButtons.appendChild(deleteButton);
        deleteButton.onclick = () => {
            console.log("Delete");
            deleteFunction(dataOb, index);
        }
        tr.appendChild(tdButtons);

        //buttonVisibility eken button tika table eke penawd ndda kyl blagnna
        if (buttonVisibility) {
            tdButtons.appendChild(editButton);
            tdButtons.appendChild(deleteButton);
            tdButtons.appendChild(printButton);
        }

        tBodyId.appendChild(tr);
    });
};

//modify column eke dropdown ehekat button danewa
/* const fillTableTwo = (tBodyId, datalist, columnList, editFunction, deleteFunction, printFunction, buttonVisibility = true) => {
 
    infoTbody.innerHTML = "";
 
    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr");
 
        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);
 
        columnList.forEach(columnOb => {
            let td = document.createElement("td");
 
            if (columnOb.dataType == "string") {
                //dataOb kyela datalist eke eka object ekak aran ekata property eke nama dila access krenewa.. [columnOb.property] me wdyta dala thyenne string ekaka dataOb.property wdyt gnna ba.
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            tr.appendChild(td);
        });
 
        let tdButtons = document.createElement("td");
 
        let dropdownDiv = document.createElement("div"); dropdownDiv.className = "dropdown";
        let dropdownButton = document.createElement("button"); dropdownButton.innerHTML = "Optoin";
        //dropdown icon eka aregnna wdya
        dropdownButton.className = "btn btn-otuline-primary dropdown-toggle";
        dropdownButton.setAttribute("data-bs-toggle", "dropdown");
        let dropdownUI = document.createElement("ui"); dropdownUI.className = "dropdown-menu";
 
        let editLi = document.createElement("li"); editLi.className = "dropdown-item";
        let deleteLi = document.createElement("li"); deleteLi.className = "dropdown-item";
        let printLi = document.createElement("li"); printLi.className = "dropdown-item";
 
 
        dropdownDiv.appendChild(dropdownButton);
        dropdownDiv.appendChild(dropdownUI);
 
        dropdownUI.appendChild(editLi);
        dropdownUI.appendChild(deleteLi);
        dropdownUI.appendChild(printLi);
 
 
        let editButton = document.createElement("button");
        editButton.className = "btn btn-outline-warning fw-bold me-2"
        editButton.innerHTML = "<i class='fa-solid fa-clock-rotate-left icon'></i><br> Update";
        // editButton.innerText = "Edit";
        tdButtons.appendChild(editButton);
        editButton.onclick = () => {
            editFunction(dataOb, index);
        }
        editLi.appendChild(editButton);
 
        let printButton = document.createElement("button");
        printButton.className = "btn btn-outline-success fw-bold me-2"
        printButton.innerHTML = "<i class='fa fa-print'></i><br> Print";
        // printButton.innerText = "Print";
        tdButtons.appendChild(printButton);
        printButton.onclick = () => {
            printFunction(dataOb, index);
        }
        printLi.appendChild(printButton);
 
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-outline-danger fw-bold me-2"
        deleteButton.innerHTML = "<i class='fa fa-trash'></i><br> Delete";
        // deleteButton.innerText = "Delete";
        tdButtons.appendChild(deleteButton);
        deleteButton.onclick = () => {
            deleteFunction(dataOb, index);
        }
        deleteLi.appendChild(deleteButton);
 
        if (buttonVisibility) {
            tdButtons.appendChild(dropdownDiv);
            tr.appendChild(tdButtons);
        }
        tr.appendChild(tdButtons);
 
        infoTbody.appendChild(tr);
    });
 
}; */

//row eka click kalama button visible wenw
const fillTableThree = (tBodyId, datalist, columnList, editFunction, buttonVisibility = true) => {

    tBodyId.innerHTML = "";

    datalist.forEach((dataOb, index) => {

        let tr = document.createElement("tr");
        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);

        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            if (columnOb.dataType == "string") {
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            tr.appendChild(td);
        });

        //buttonVisibility eken button tika table eke penawd ndda kyl blagnna
        if (buttonVisibility) {
            //html eke call krepu function wekata data parse kranna dataOb, Index pass krenewa
            tr.onclick = () => {
                window['editob'] = dataOb;
                window['editrowno'] = index;
                activeTableRow(tBodyId, index, "white");
                divModifybtn.className = "d-block";
                editFunction(dataOb, index);
            }
            //editFunction(dataOb, index);  //table row eka click kraddi open wenne nathi wenna one nisa
        }
        tBodyId.appendChild(tr);
    });
};

//row eka click kalama form eka open wela form eka athule print delete button enewa
const fillTableFour = (infoTbody, datalist, columnList, editFunction, deleteFunction, printFunction, buttonVisibility = true) => {

    infoTbody.innerHTML = "";

    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);

        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            if (columnOb.dataType == "string") {
                //dataOb kyela datalist eke eka object ekak aran ekata property eke nama dila access krenewa.. [columnOb.property] me wdyta dala thyenne string ekaka dataOb.property wdyt gnna ba.
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "decimal") {
                //object eke value eka decimal point dekakin table eke show kregnna property eka float ekak baweta convert krenw
                td.innerText = parseFloat(dataOb[columnOb.property]).toFixed(2);
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            if (columnOb.dataType == "image-array") {
                // img tag ekak create kregnna one
                let img = document.createElement("img");
                // class eke value add krenewa photo eke size ekata
                img.style = "width:110px";
                // data object eke property eka access krela nullda blnewa
                if (dataOb[columnOb.property] != null) {
                    // null naththan object eke image eka pass krnw
                    img.src = atob(dataOb[columnOb.property]);
                }
                // td ekata image eka assign krnw
                td.appendChild(img);
            }
            tr.appendChild(td);
        });

        //buttonVisibility eken button tika table eke penawd ndda kyl blagnna
        if (buttonVisibility) {
            //html eke call krepu function welata data parse kranna methana dataOb, Index parse krenewa
            tr.onclick = () => {
                window['editob'] = dataOb;
                window['editrowno'] = index;
                activeTableRow(infoTbody, index, "Cornsilk");
                divModifybtn.className = "d-block";
                editFunction(dataOb, index);
            }
        }
        infoTbody.appendChild(tr);
    });
};

//element array ekak gennagena ewata default color eka add krenwa
const setDefault = (elements) => {
    elements.forEach(element => {
        element.style.border = "solid 1px #ced4da";
    });
}

//define function for getServiceRequest
const getServiceRequest = (url) => {
    let serverResponse = [];

    $.ajax({
        url: url,//The URL to which the request is sent
        type: 'GET',//The HTTP method to use for the request (GET, POST, PUT, DELETE, etc.)
        //data:{key1: 'value1',key2: 'value2'} //Data to be sent to the server
        async: false, //wait for response
        contentType: "application/json",
        success: function (response) {
            //Code to execute if the request succeeds
            console.log('Success: ', response);
            serverResponse = response;
        },
        error: function (xhr, status, error) {
            //code to execute if the request fails
            console.log('Error: ', error);
        }
    });
    return serverResponse;
}

//define function for PUT, POST, DELETE request
const getHTTPServiceRequest = (url, method, dataOb) => {
    let serverResponse = [];

    $.ajax({
        url: url,//The URL to which the request is sent
        type: method,//The HTTP method to use for the request (GET, POST, PUT, DELETE, etc.)
        data: JSON.stringify(dataOb), //{key1: 'value1',key2: 'value2'} //Data to be sent to the server
        async: false, //wait for response
        contentType: "application/json", //Json is storing and transporting format ekak 
        success: function (response) {
            //Code to execute if the request succeeds
            console.log('Success: ', response);
            serverResponse = response;
        },
        error: function (xhr, status, error) {
            //code to execute if the request fails
            console.log('Error: ', error);
            serverResponse = error;
        }
    });
    return serverResponse;
}

//define function for format date in table
/* const formatDate = (dateString, format = "long") => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (format === "dd-mmm-yyyy") {
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } else if (format === "mmm-d-yyyy") {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    return date.toISOString().split("T")[0]; //split("T") gives ["2025-10-02", "00:00:00"] take the [0] part → "2025-10-02"
}; */

// define function for Inner form table
//modify column eke dropdown ehekat button danewa
const fillInnerTable = (InnertBody, datalist, columnList, editFunction, deleteFunction, buttonVisibility = true) => {

    InnertBody.innerHTML = "";

    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt((index) + 1);
        tr.appendChild(tdIndex);

        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            if (columnOb.dataType == "string") {
                //dataOb kyela datalist eke eka object ekak aran ekata property eke nama dila access krenewa.. [columnOb.property] me wdyta dala thyenne string ekaka dataOb.property wdyt gnna ba.
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            if (columnOb.dataType == "decimal") {
                //object eke value eka decimal point dekakin table eke show kregnna property eka float ekak baweta convert krenw
                td.innerText = parseFloat(dataOb[columnOb.property]).toFixed(2);
            }
            tr.appendChild(td);
        });

        let tdButtons = document.createElement("td");

        let dropdownDiv = document.createElement("div"); dropdownDiv.className = "dropdown";
        let dropdownButton = document.createElement("button"); dropdownButton.innerHTML = "<i class='fa-solid fa-angle-down'></i>"; // <i class="fa-solid fa-ellipsis"></i>
        //dropdown icon eka aregnna wdya
        dropdownButton.className = "btn btn-outline-secondary";
        dropdownButton.setAttribute("data-bs-toggle", "dropdown");
        let dropdownUI = document.createElement("ui");
        dropdownUI.className = "dropdown-menu";

        let editLi = document.createElement("li"); editLi.className = "dropdown-item";
        let deleteLi = document.createElement("li"); deleteLi.className = "dropdown-item";

        dropdownDiv.appendChild(dropdownButton);
        dropdownDiv.appendChild(dropdownUI);

        dropdownUI.appendChild(editLi);
        dropdownUI.appendChild(deleteLi);

        let editButton = document.createElement("button");
        editButton.className = "btn btn-outline-warning fw-bold"
        editButton.innerHTML = "<i class='fa-regular fa-pen-to-square'></i>";
        // editButton.innerText = "Edit";
        tdButtons.appendChild(editButton);
        editButton.onclick = () => {
            editFunction(dataOb, index);
        }
        editLi.appendChild(editButton);

        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-outline-danger fw-bold"
        deleteButton.innerHTML = "<i class='fa fa-trash'></i>";
        // deleteButton.innerText = "Delete";
        tdButtons.appendChild(deleteButton);
        deleteButton.onclick = () => {
            deleteFunction(dataOb, index);
        }
        deleteLi.appendChild(deleteButton);

        if (buttonVisibility) {
            tdButtons.appendChild(dropdownDiv);
            tr.appendChild(tdButtons);
        }
        tr.appendChild(tdButtons);

        InnertBody.appendChild(tr);
    });

};

const fillInnerTableFooter = (footerID, datalist, columnList, rows) => {
    footerID.innerHTML = ""; //clear existing data

    // Initialize totals for each decimal column
    const totals = {};
    columnList.forEach(column => {
        if (column.dataType === "decimal") {
            totals[column.property] = 0;
        }
    });

    //Sum all decimal values from datalist
    datalist.forEach(dataOb => {
        for (const column of columnList) {
            if (column.dataType === "decimal") {
                const value = parseFloat(dataOb[column.property]) || 0;
                totals[column.property] += value;
            }
        }
    });

    const tr = document.createElement("tr");

    // Create a footer row to show totals
    const tdLabel = document.createElement("td");
    tdLabel.className = "text-start fw-bold";
    tdLabel.setAttribute("colspan", rows);
    tdLabel.innerText = "Total Amount";
    tr.appendChild(tdLabel);

    columnList.forEach(column => {
        const td = document.createElement("td");
        td.className = "fw-bold";

        if (column.dataType == "decimal") {
            //object eke value eka decimal point dekakin table eke show kregnna property eka float ekak baweta convert krenw
            // td.innerText = parseFloat(dataOb[column.property]).toFixed(2);
            td.innerText = totals[column.property].toFixed(2);
        } else {
            td.innerText = "-"; // optional fallback
        }
        tr.appendChild(td);
    });

    footerID.appendChild(tr);
}

const fillDropdownOrder = (parentId, message, datalist1, datalist2, property) => {
    parentId.innerHTML = "";
    if (message != "") {
        let optionMSG = document.createElement("option");
        optionMSG.innerText = message;
        optionMSG.selected = "selected";
        optionMSG.value = "";
        optionMSG.disabled = "disabled";
        parentId.appendChild(optionMSG);
    }

    datalist1.forEach((dataOb) => {
        let option = document.createElement("option");
        //value attribute eke format eka string wenna ona nisa json string welata convert krenewa.
        option.value = JSON.stringify(dataOb);
        //submit kraddi javascript object bawata convert kranna one // dynamic eken gnna one object string one na.. Static welata string hodai..
        option.innerText = dataOb[property];
        parentId.appendChild(option)
    });
    datalist2.forEach((dataOb) => {
        let option = document.createElement("option");
        //value attribute eke format eka string wenna ona nisa json string welata convert krenewa.
        option.value = JSON.stringify(dataOb);
        //submit kraddi javascript object bawata convert kranna one // dynamic eken gnna one object string one na.. Static welata string hodai..
        option.innerText = dataOb[property];
        parentId.appendChild(option)
    });
}

const formatDateRange = (minInputElement, maxInputElement, minrange, maxrange) => {
    const formatDate = (date) => {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');// [0-11]
        let day = String(date.getDate()).padStart(2, '0');// [1-31]
        return year + "-" + month + "-" + day;
    };

    //current date object ekak hdagnnw 
    let currentDate = new Date();

    // Set min input range --> currentDate - 7 to currentDate
    const minStart = new Date(currentDate);
    minStart.setDate(currentDate.getDate() - minrange);
    const minEnd = new Date(currentDate);

    minInputElement.min = formatDate(minStart);
    minInputElement.max = formatDate(minEnd);

    // Set max input range --> currentDate to currentDate + 14
    const maxStart = new Date(currentDate);
    const maxEnd = new Date(currentDate);
    maxEnd.setDate(currentDate.getDate() + maxrange);

    maxInputElement.min = formatDate(maxStart);
    maxInputElement.max = formatDate(maxEnd);
}


