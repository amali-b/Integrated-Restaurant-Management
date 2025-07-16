//browser load event handler
window.addEventListener("load", () => {

    //call refresh form
    refreshIngredientForm();

    //call refresh Table
    refreshIngredienttable();
});

// define function for ingredient category form
const refreshIngCategoryForm = () => {
    // formCategory.reset();

    ingredientcategory = new Object();

    setDefault([txtCategory]);
}

const buttonCategorySubmit = () => {
    console.log(ingredientcategory);

    if (ingredientcategory.name != null) {
        Swal.fire({
            title: "Are you sure to Submit following Category " + ingredientcategory.name + " .?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                let submitResponse = getHTTPServiceRequest('/ingredientcategory/insert', "POST", ingredientcategory);
                if (submitResponse == "OK") {
                    let ingredientcategories = getServiceRequest("/ingredientcategory/alldata");
                    fillDropdown(SelectCategory, "Select Ingredient Category.!", ingredientcategories, "name");
                    SelectCategory.value = JSON.stringify(ingredientcategories[0]);
                    SelectCategory.style.border = "2px solid green";
                    ingredient.ingredientcategory_id = JSON.parse(SelectCategory.value);
                    Swal.fire({
                        title: "Saved Successfully..!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1800
                    });
                    refreshIngCategoryForm();
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
            title: "Failed to Submit.!",
            text: "Enter Category Name.!",
            icon: "error"
        });
    }
}

//define refresh form function
const refreshIngredientForm = () => {
    formIngredient.reset();
    btnsubmit.style.display = "inline";
    btnupdate.style.display = "none";

    //define Item Object
    ingredient = new Object();

    const ingredientcategories = getServiceRequest("/ingredientcategory/alldata");
    fillDropdown(SelectCategory, "Select Ingredient Category.!", ingredientcategories, "name");

    const ingredientstatuses = getServiceRequest("/ingredientstatus/alldata");
    fillDropdown(SelectStatus, "Select Status.!", ingredientstatuses, "name");

    const unittypes = getServiceRequest("/unitType/alldata");
    fillDropdown(SelectUnitType, "Select Unit Type.!", unittypes, "name");

    setDefault([SelectCategory, txtIngredientname, unitSize, txtPrice, txtRop, txtRoq, SelectStatus, SelectUnitType]);

    //select element eke value eka string value ekak wenna one nisa object eka string baweta convert krenw
    SelectStatus.value = JSON.stringify(ingredientstatuses[0]);
    //ena string value eka object ekata set kranna json.parse eken object ekt convert krnw
    ingredient.ingredientstatus_id = JSON.parse(SelectStatus.value);
    //select element eke border color eka change kranna one
    SelectStatus.style.border = "2px solid green";
    SelectStatus.disabled = true;
}

/* 
// dynamic validator ekak noda select tags validate kregnna
let selectCategoryElement = document.querySelector("#SelectCategory");
selectCategoryElement.addEventListener("change", () => {
    //stringify value ekak thyena nisa eka JSON parse krela category object ekak gnnewa
    let category = JSON.parse(selectCategoryElement.value);
    selectCategoryElement.style.border = "2px solid green"

    // ####### to hide element ####### //
    if (category.name == "Rice") {
        ElementId.disabled = "disabled";
        ElementId.disabled = ""; // enable krnw
    }

    // filterwela enna one item eke value ekta adala values set krnw
    itemName.value = category.name;
}); 
*/

//define refresh table function
const refreshIngredienttable = () => {
    let ingredients = getServiceRequest("/ingredient/alldata");

    // Format purchase_price to 2 decimal places
    /* ingredients.forEach(item => {
        item.purchase_price = Number(item.purchase_price).toFixed(2);
    }); */

    let columns = [
        { property: "code", dataType: "string" },
        { property: "ingredient_name", dataType: "string" },
        { property: getIngredientCategory, dataType: "function" },
        { property: getUnitSize, dataType: "function" },
        { property: "reoder_point", dataType: "string" },
        { property: "reorder_quantity", dataType: "string" },
        { property: "purchase_price", dataType: "decimal" },
        { property: getIngredientStatus, dataType: "function" }
    ];

    //call fill data into table

    fillTableFour(tBodyIngredient, ingredients, columns, ingredientFormRefill, true);
    $('#tableIngredient').DataTable();
}

const getIngredientCategory = (dataOb) => {
    return dataOb.ingredientcategory_id.name;
}

const getUnitSize = (dataOb) => {
    return dataOb.measuring_unit + " " + dataOb.unittype_id.name;
}

const getIngredientStatus = (dataOb) => {
    if (dataOb.ingredientstatus_id.name == "Available") {
        return "<p class='btn btn-outline-success text-center'>" + dataOb.ingredientstatus_id.name + "</p>";
    }
    if (dataOb.ingredientstatus_id.name == "Not-Available") {
        return "<p class='btn btn-outline-warning text-center'>" + dataOb.ingredientstatus_id.name + "</p>";
    }
    if (dataOb.ingredientstatus_id.name == "Removed") {
        return "<p class='btn btn-outline-danger text-center'>" + dataOb.ingredientstatus_id.name + "</p>";
    }
    return dataOb.ingredientstatus_id.name;
}

//define Form edit function
const ingredientFormRefill = (ob, rowIndex) => {
    // open ingredient form modal
    $('#modalIngredient').modal('show');

    btnsubmit.style.display = "none"; // do not display submit button 
    btnupdate.style.display = "inline"; // displau update button

    ingredient = JSON.parse(JSON.stringify(ob)); // new object for changes
    oldingredient = JSON.parse(JSON.stringify(ob)); // existing object

    SelectCategory.value = JSON.stringify(ob.ingredientcategory_id);
    txtIngredientname.value = ob.ingredient_name;
    SelectUnitType.value = JSON.stringify(ob.unittype_id);
    unitSize.value = ob.measuring_unit;
    SelectStatus.value = JSON.stringify(ob.ingredientstatus_id);
    txtPrice.value = ob.purchase_price;
    txtRop.value = ob.reoder_point;
    txtRoq.value = ob.reorder_quantity;
}

//define function to check errors
const checkFormError = () => {
    let errors = "";
    if (ingredient.ingredientcategory_id == null) {
        SelectCategory.style.border = "2px solid red";
        errors = errors + "Please Select Ingredient Category First.! \n";
    }
    if (ingredient.ingredient_name == null) {
        txtIngredientname.style.border = "2px solid red";
        errors = errors + "Please Enter valid Ingredient Name.! \n";
    }
    if (ingredient.unittype_id == null) {
        SelectUnitType.style.border = "2px solid red";
        errors = errors + "Please Select Unit Type.! \n";
    }
    if (ingredient.measuring_unit == null) {
        unitSize.style.border = "2px solid red";
        errors = errors + "Please Enter valid Unit Size.! \n";
    }
    if (ingredient.ingredientstatus_id == null) {
        SelectStatus.style.border = "2px solid red";
        errors = errors + "Please Select Status.! \n";
    }
    if (ingredient.purchase_price == null) {
        txtPrice.style.border = "2px solid red";
        errors = errors + "Please Enter valid Purchase Price.! \n";
    }
    if (ingredient.reoder_point == null) {
        txtRop.style.border = "2px solid red";
        errors = errors + "Please Enter valid Reorder Point.! \n";
    }
    if (ingredient.reorder_quantity == null) {
        txtRoq.style.border = "2px solid red";
        errors = errors + "Please Enter valid Reorder Quantity.! \n";
    }
    return errors;
}

//define function for check for updates
const checkFormUpdate = () => {
    let updates = "";
    if (ingredient != null && oldingredient != null) {
        if (ingredient.ingredient_name != oldingredient.ingredient_name) {
            updates = updates + "Ingredient Name has Updated from " + oldingredient.ingredient_name + "--> " + ingredient.ingredient_name + " \n";
        }
        if (ingredient.measuring_unit != oldingredient.measuring_unit) {
            updates = updates + "Unit Size has Updated from " + oldingredient.measuring_unit + "--> " + ingredient.measuring_unit + " \n";
        }
        if (ingredient.unittype_id.name != oldingredient.unittype_id.name) {
            updates = updates + "Unit Type has Updated from " + oldingredient.unittype_id.name + "--> " + ingredient.unittype_id.name + " \n";
        }
        if (ingredient.purchase_price != oldingredient.purchase_price) {
            updates = updates + "Purchase Price has Updated from " + oldingredient.purchase_price + "--> " + ingredient.purchase_price + " \n";
        }
        if (ingredient.reoder_point != oldingredient.reoder_point) {
            updates = updates + "Reorder point has Updated from " + oldingredient.reoder_point + "--> " + ingredient.reoder_point + " \n";
        }
        if (ingredient.reorder_quantity != oldingredient.reorder_quantity) {
            updates = updates + "Reorder quantity has Updated from " + oldingredient.reorder_quantity + "--> " + ingredient.reorder_quantity + " \n";
        }
        if (ingredient.ingredientstatus_id.name != oldingredient.ingredientstatus_id.name) {
            updates = updates + "Status has Updated from " + oldingredient.ingredientstatus_id.name + "--> " + ingredient.ingredientstatus_id.name + " \n";
        }
    }
    return updates;
}

//define function for update button
const buttonItemUpdate = () => {

    console.log("object Update", ingredient);

    //check if there are any errors
    let errors = checkFormError();

    //check errors
    if (errors == "") {
        //check updates
        let updates = checkFormUpdate();

        let title = "Are you sure you want to update following changes.?";
        let text = updates;
        let updateResponse = ['/ingredient/update', "PUT", ingredient];
        swalUpdate(updates, title, text, updateResponse, modalIngredient);

    } else {
        Swal.fire({
            title: "Failed to Update.! Has following errors : ",
            text: errors,
            icon: "error"
        });
    }
}

//define function for submit button
const buttonItemSubmit = () => {
    //check if there are any errors
    let errors = checkFormError();
    title = "Are you sure to Submit following Ingredient ";
    obName = ingredient.ingredient_name;
    text = "Unit Size : " + ingredient.measuring_unit + ingredient.unittype_id.name
        + ", Purchase Price : " + ingredient.purchase_price;
    let submitResponse = ['/ingredient/insert', "POST", ingredient];
    swalSubmit(errors, title, obName, text, submitResponse, modalIngredient);
}

//function define for delete Ingredient record
const itemDelete = (ob, rowIndex) => {
    ingredient = ob;
    title = "Are you sure to Delete followong Ingredient.?";
    obName = "";
    text = ob.ingredient_name;
    let deleteResponse = ['/ingredient/delete', "DELETE", ingredient];
    message = "Ingredient has Deleted.";
    swalDelete(title, obName, text, deleteResponse, modalIngredient, message);
}

//define function for clear/reset button
const buttonItemClear = () => {
    Swal.fire({
        title: "Are you Sure to Refresh Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshIngredientForm();
        }
    });
}

//define function for modal close and refresh form
const buttonModalClose = () => {
    Swal.fire({
        title: "Are you Sure to Close Ingredient Form.?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshIngredientForm();
            $('#modalIngredient').modal('hide');
            //call refresh Table
            refreshIngredienttable();
        }
    });
}

