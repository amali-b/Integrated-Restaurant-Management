/* const ctx = document.getElementById('myChart');

new Chart(ctx, {
    // chart type eka mkkd
    type: 'bar',
    // x axis eke dala thyena data
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3], //lable array ekata samana wenna one
            borderWidth: 1
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
}); */

const customer = document.getElementById('myChart');

new Chart(customer, {
    // chart type eka mkkd
    type: 'pie',
    // x axis eke dala thyena data
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3], //lable array ekata samana wenna one
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }
});

//function define for print Supplier Order record
const printChart = (ob, rowIndex) => {
    console.log("Print", ob, rowIndex);
    let newWindow = window.open();

    const currentDateTime = new Date().toLocaleString();
    const printView = `
        <html>
        <head>
            <title>Customer Report Management | BIT 2025</title>
            <link rel="stylesheet" href="bootstrap-5.2.3/css/bootstrap.min.css">
            <style>
                body {
                    padding: 30px;
                    font-family: Arial, sans-serif;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header img {
                    max-width: 100px;
                    display: block;
                    margin: 0 auto 10px auto;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }
                .date-time {
                    font-size: 12px;
                    color: #555;
                }
                table {
                    margin: auto;
                    width: 60%;
                }
                th {
                    text-align: left;
                    width: 40%;
                    background-color: #f8f9fa;
                    padding: 8px;
                }
                td {
                    background-color: #fff;
                    padding: 8px;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="images/bando1.png" alt="Logo">
                <h1>Customer Performance Report</h1>
                <div class="date-time">Printed on: ${currentDateTime}</div>
            </div>
            <div>
                <img src="${customer.toDataURL()}"/>
            </div>
            <div class="footer">
                &copy; 2025 BIT Project. All rights reserved.
            </div>
        </body>
        </html>
    `;

    newWindow.document.open();
    newWindow.document.writeln(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 300);
}