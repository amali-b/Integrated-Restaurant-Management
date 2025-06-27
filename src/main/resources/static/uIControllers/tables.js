//browser load event handler
window.addEventListener("load", () => {

    //call refresh form
    refreshForm();
    //call refresh Table
    refreshtableDineinTable();
});

//define function for refresh form
const refreshForm = () => {
    formTables.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    //define new object
    table = new Object();

    setDefault([txtTblNo, countSeat]);
}

//table ekema modify column eke buttons danewa
const fillTable = (tBodyDineinTables, datalist, columnList, editFunction, deleteFunction, buttonVisibility = true) => {
    tBodyDineinTables.innerHTML = "";

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
            tr.appendChild(td);
        });

        let tdButton = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-outline-danger fw-bold me-2"
        deleteButton.innerHTML = "<i class='fa fa-trash'></i><br> Delete";
        // deleteButton.innerText = "Delete";
        tdButton.appendChild(deleteButton);
        deleteButton.onclick = () => {
            console.log("Delete");
            deleteFunction(dataOb, index);
        }
        tr.appendChild(tdButton);

        //buttonVisibility eken button tika table eke penawd ndda kyl blagnna
        if (buttonVisibility) {
            //html eke call krepu function welata data parse kranna methana dataOb, Index parse krenewa
            tr.onclick = () => {
                window['editob'] = dataOb;
                window['editrowno'] = index;
                activeTableRow(tBodyDineinTables, index, "Cornsilk");
                editFunction(dataOb, index);
            }
            tdButton.appendChild(deleteButton);
        }
        tBodyDineinTables.appendChild(tr);
    });
};

//create refresh table function
const refreshtableDineinTable = () => {
    // const tables = getServiceRequest("/table/alldata");
    let tables = [
        {
            id: 1,
            number: "001",
            seatcount: 4
        }
    ];
    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    const columns = [
        { property: "number", dataType: "string" },
        { property: "seatcount", dataType: "string" }
    ];

    //call fill data into table
    fillTable(tBodyDineinTables, tables, columns, tablesFormRefill, tableDelete, true);
    // $('#tableDineinTables').DataTable();
}

//define Form edit function
const tablesFormRefill = (ob, rowIndex) => {
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    table = JSON.parse(JSON.stringify(ob));
    oldtable = JSON.parse(JSON.stringify(ob));

    txtTblNo.value = ob.number;
    countSeat.value = ob.seatcount;
}

const tableDelete = (ob, index) => {
    table = ob;
    title = "Are you sure to Delete Selected Table";
    obName = "Table No. : " + ob.tables.number + " .?";
    text = "Seats : " + ob.seatcount;
    let deleteResponse = getHTTPServiceRequest('/order/delete', "DELETE", order);
    message = "Table has Deleted.";
    swalDelete(title, obName, text, deleteResponse, "", message);
}
