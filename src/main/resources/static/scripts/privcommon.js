//define function for avtivetablebodyrow
const activeTableRow = (infoTbody, rowIndex, color) => {

    for (const element of infoTbody.children) {
        element.removeAttribute("style");
    }
    infoTbody.children[parseInt(rowIndex)].style.backgroundColor = color;
}

//define function for fill data in to select
const fillDropdown = (parentId, message, datalist, property) => {
    parentId.innerText = "";
    let optionMSG = document.createElement("option");
    optionMSG.innerText = message;
    optionMSG.selected = "selected";
    optionMSG.disabled = "disabled";
    parentId.appendChild(optionMSG);

    datalist.forEach((dataOb) => {
        let option = document.createElement("option");
        //value attribute eke format eka string wenna ona nisa json string welata convert krenewa.
        //submit kraddi javascript object bawata convert kranna one
        //dynamic eken gnna one object string one na.. Static welata string hodai..
        option.value = JSON.stringify(dataOb);
        option.innerText = dataOb[property];
        parentId.appendChild(option);
    });
};

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
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }
            tr.appendChild(td);
        });

        //buttonVisibility eken button tika table eke penawd ndda kyl blagnna
        if (buttonVisibility) {
            //html eke call krepu function welata data parse kranna methana dataOb, Index parse krenewa
            tr.onclick = () => {
                window['editob'] = dataOb;
                window['editrowno'] = index;
                activeTableRow(infoTbody, index, "White");
                divModifybtn.className = "d-block";
                editFunction(dataOb, index);
            }
        }

        infoTbody.appendChild(tr);
    });
};

const setDefault = (elements) => {
    elements.forEach(element => {
        element.style.borderBottom = "solid 1px #ced4da";
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
        contentType: "application/json",
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