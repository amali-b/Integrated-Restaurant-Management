const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("expand");
});

// generate Chart
const chrtline = document.getElementById('lineChart');

new Chart(chrtline, {
    // chart type eka mkkd
    type: 'line',
    // x axis eke dala thyena data
    data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        datasets: [{
            label: 'Sales Trends',
            data: [50, 65, 60, 75, 62, 70, 71], //lable array ekata samana wenna one
            fill: true,
            borderColor: '#954836ff',
            tension: 0.4
            // borderWidth: 1,
            // backgroundColor: getRandomHexColor(data.length)
        }]
    }
});


// generate Doughnut Chart
const ctx = document.getElementById('doughnutChart');

new Chart(ctx, {
    // chart type eka mkkd
    type: 'doughnut',
    // x axis eke dala thyena data
    data: {
        labels: ['Biriyani', 'Fried-Rice', 'Chichen-Kottu', 'Nasi-Gorang'],
        datasets: [{
            label: 'Top Selling Items',
            data: ['7', '20', '35', '5'], //lable array ekata samana wenna one
            borderWidth: 1,
            radius: "75%",
            hoverOffset: 4,
            backgroundColor: ['#954836ff', '#a35431ff', '#c0624dff', '#a8655aff']
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