const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("expand");
});

window.addEventListener("load", () => {
    // get sales summary of order payments
    let dataObPayments = getServiceRequest("/dashboard/paymentsbylastweek");
    txtSaleSummary.innerHTML = "";
    txtSaleSummary.innerText = "LKR " + dataObPayments;

    // get sales summary of orders
    let dataObOrders = getServiceRequest("/dashboard/ordersbylastweek");
    txtOrderSummary.innerHTML = "";
    txtOrderSummary.innerText = dataObOrders;

    // get summary of supplier payments
    let dataObSupplyPaymnets = getServiceRequest("/dashboard/supplyPaymentsbyonemonth");
    txtSupplierPayments.innerHTML = "";
    txtSupplierPayments.innerText = "LKR " + dataObSupplyPaymnets;

    // get summary of supplier payments
    let dataObCustomerRegister = getServiceRequest("/dashboard/customerregistration");
    txtCustomerRegister.innerHTML = "";
    txtCustomerRegister.innerText = dataObCustomerRegister;

    // call chart functions when browser load
    generateLineChart();
    generateDoughnutChart();
});

const generateLineChart = () => {
    /* ############### Generate Dashboard Sales Trend Chart ################ */

    // get datalist array of order payments by previous six month
    let datalist = getServiceRequest("/dashboard/orderPaymentbysixmonth");

    // define array for chart labels
    let label = new Array();

    //define array for chart data 
    let data = new Array();

    // datalist eke ena data array eke each index ekin eka aran object welata dagnnewa
    for (const index in datalist) {
        // define new object
        let object = new Object();
        // hadagaththa object ekata datalist eken ena data array dagnnewa
        // Object.year = datalist[index][0]; //datalist eke ena eka array ekakin ena palaweni insex eka
        object.month = datalist[index][0];
        object.amount = datalist[index][1];

        // assign object values to lable and data arrays
        label.push(datalist[index][0]);
        data.push(datalist[index][1]);
    }

    // generate Chart
    const chrtline = document.getElementById('lineChart');

    new Chart(chrtline, {
        // chart type eka mkkd
        type: 'line',
        // x axis eke dala thyena data
        data: {
            labels: label,
            datasets: [{
                label: 'Sales Trends',
                data: data, //lable array ekata samana wenna one
                fill: true,
                borderColor: '#954836ff',
                tension: 0.4
                // borderWidth: 1,
                // backgroundColor: getRandomHexColor(data.length)
            }]
        }
    });
}


const generateDoughnutChart = () => {
    /* ############### Generate Dashboard Sales Trend Chart ################ */

    // get datalist array of order payments by previous six month
    let datalist = getServiceRequest("/dashboard/topsellingSubmenus");

    // define array for chart labels
    let label = new Array();

    //define array for chart data 
    let data = new Array();

    // datalist eke ena data array eke each index ekin eka aran object welata dagnnewa
    for (const index in datalist) {
        // assign object values to lable and data arrays
        label.push(datalist[index][0]);
        data.push(datalist[index][1]);
    }

    // generate Doughnut Chart
    const ctx = document.getElementById('doughnutChart');

    new Chart(ctx, {
        // chart type eka mkkd
        type: 'doughnut',
        // x axis eke dala thyena data
        data: {
            labels: label,
            datasets: [{
                label: 'Top Selling Items',
                data: data, //lable array ekata samana wenna one
                borderWidth: 1,
                radius: "80%",
                hoverOffset: 4,
                backgroundColor: ['#7a3323ff', '#954836ff', '#a0573fff', '#a55746ff', '#b66a5eff']
            }]
        },
        options: {
            scales: {
                // y axis eke dala thyena data
                y: {
                    beginAtZero: true // y axis eka 0 idela ptn gnna one
                }
            }
        }
    });
}

