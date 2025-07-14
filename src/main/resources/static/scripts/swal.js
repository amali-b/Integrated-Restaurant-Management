// define common swal submit function 
const swalSubmit = (errors, title, obName, text, submitResponse, modalId) => {
    //check errors
    if (errors == "") {
        Swal.fire({
            //if there are no errors get confirmation
            title: title + obName + ".?",
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post servise for insert data
                submitResponse = getHTTPServiceRequest(submitResponse[0], submitResponse[1], submitResponse[2]);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully..!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    window.location.reload();
                    $(modalId).modal('hide');
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Failed to Submit.! Has following errors :",
            text: errors,
            icon: "error"
        });
    }

}

// define common swal update function 
const swalUpdate = (updates, title, text, updateResponse, modalId) => {
    if (updates == "") {
        Swal.fire({
            title: "Nothing Changed..!",
            icon: "info",
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call put service
                updateResponse = getHTTPServiceRequest(updateResponse[0], updateResponse[1], updateResponse[2]);
                if (updateResponse == "OK") {
                    Swal.fire({
                        title: "Successfully Updated..!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    window.location.reload();
                    $(modalId).modal('hide');
                } else {
                    Swal.fire({
                        title: "Failed to Update.! Has following errors :",
                        text: updateResponse,
                        icon: "info"
                    });
                }
            }
        });
    }
}

// define common swal delete function
const swalDelete = (title, obName, text, deleteResponse, modalId, message) => {
    Swal.fire({
        title: title + obName + ".?",
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            //call delete servise for delete supplier
            deleteResponse = getHTTPServiceRequest(deleteResponse[0], deleteResponse[1], deleteResponse[2]);
            if (deleteResponse == "OK") {
                Swal.fire({
                    title: "Deleted Successfully.!",
                    text: message,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                //refresh table & Form
                window.location.reload();
                $(modalId).modal('hide');
            } else {
                Swal.fire({
                    title: "Failed to Delete.!",
                    text: deleteResponse,
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                text: "Your data is safe!",
                icon: "error"
            });
        }
    });
}

/* if (result.isConfirmed) {
    // updateResponse eka gnna function eka async nm promise value ekak ywnne..  
    // Run the function after confirmation
    Promise.resolve(updateFunction()).then(updateResponse => {
        if (updateResponse === "OK") {
            Swal.fire({
                title: "Successfully Updated..!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload();
                $(modalId).modal('hide');
            });
        } else {
            Swal.fire({
                title: "Failed to Update.! Has following errors:",
                text: updateResponse,
                icon: "info"
            });
        }
    });
}
// main js eke call wenna one mehema
swalUpdate(updates, title, text, () => getHTTPServiceRequest('/supplier/update', "PUT", supplier), modalSupplier); */