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

    txtTblNo.disabled = false;

    //define new object
    tableDinein = new Object();

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
        deleteButton.className = "btn btn-outline-danger"
        deleteButton.innerHTML = "<i class='fa fa-trash'></i>";
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
    const tables = getServiceRequest("/tables/alldata");
    /* let tables = [
        {
            id: 1,
            number: "001",
            seatcount: 4
        }
    ];
    
    *///datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "number", dataType: "string" },
        { property: "seatcount", dataType: "string" }
    ];

    //call fill data into table
    fillTable(tBodyDineinTables, tables, columns, tablesFormRefill, tableDelete, true);
    $('#tableDineinTables').DataTable();
}

//define Form edit function
const tablesFormRefill = (ob, rowIndex) => {
    btnsubmit.style.display = "none";
    btnupdate.style.display = "inline";

    tableDinein = JSON.parse(JSON.stringify(ob));
    oldtableDinein = JSON.parse(JSON.stringify(ob));

    txtTblNo.value = ob.number;
    txtTblNo.disabled = true;
    countSeat.value = ob.seatcount;
}

// define function for update table details
const buttonTablesUpdate = () => {
    //check errors
    if (tableDinein.number != null && tableDinein.seatcount != (0 || null)) {
        //check updates
        let updates = "";
        if (tableDinein.seatcount != oldtableDinein.seatcount) {
            updates = updates + "Seat count has updated From : " + oldtableDinein.seatcount + " TO : " + tableDinein.seatcount;
        }
        let title = "Are you sure to update following table seat count.?";
        let text = updates;
        let updateResponse = ['/tables/update', "PUT", tableDinein];
        swalUpdate(updates, title, text, updateResponse, "");
    } else {
        Swal.fire({
            title: "Failed to Update.! Form has following errors :",
            text: errors,
            icon: "error"
        });
    }
}

// define function for add table record
const buttonTablesSubmit = () => {
    //check if there are any errors
    let errors = "";
    if (tableDinein.number == null && tableDinein.seatcount == (0 || null)) {
        countSeat.style.border = "2px solid red";
        errors = errors + "Please Enter Seat Count.!";
    }
    title = "Are you sure to Submit following Table ";
    obName = tableDinein.number;
    text = "Seats : " + tableDinein.seatcount;
    let submitResponse = ['/tables/insert', "POST", tableDinein];
    swalSubmit(errors, title, obName, text, submitResponse, "");
}

// define function delete table record
const tableDelete = (ob, index) => {
    tableDinein = ob;
    title = "Are you sure to Delete Selected ";
    obName = "Table No. : " + ob.number;
    text = "Seats : " + ob.seatcount;
    let deleteResponse = ['/tables/delete', "DELETE", tableDinein];
    message = "Table has Deleted.";
    swalDelete(title, obName, text, deleteResponse, "", message);
}

// define function clear table form
const buttonTablesClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
        }
    });
}
