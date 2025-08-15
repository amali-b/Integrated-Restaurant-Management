// Alternative approach: Configuration at the top of the file for easy maintenance
const REPORT_CONFIGURATIONS = {
    userReport: {
        dataMapping: [
            { index: 0, property: "employee_name", label: "Employee Name", dataType: "string" },
            { index: 1, property: "user_name", label: "Username", dataType: "string" },
            { index: 2, property: "email", label: "Email", dataType: "string" },
            { index: 3, property: "designations", label: "Designation", dataType: "string" },
            { index: 4, property: "status", label: "Status", dataType: "string" }
        ]
    },
    // You can add more report configurations here
    // salaryReport: { ... },
    // attendanceReport: { ... }
};

// Helper function to transform array data to objects
const transformDataToObjects = (datalist, mappingConfig) => {
    return datalist.map(row => {
        const obj = {};
        mappingConfig.forEach(config => {
            obj[config.property] = row[config.index];
        });
        return obj;
    });
};

// Helper function to get column definitions
const getColumnDefinitions = (mappingConfig) => {
    return mappingConfig.map(config => ({
        property: config.property,
        dataType: config.dataType,
        label: config.label
    }));
};
window.addEventListener("load", () => {
    // Initialize dropdowns with data
    const designations = getServiceRequest("/designation/alldata");
    const employeeStatuses = getServiceRequest("/employeestatus/alldata");

    fillDropdown(selectDesignation, "Select Designation", designations, "name");
    fillDropdown(selectStatus, "Select Status", employeeStatuses, "status");
});

// Generate report function
const generateReport = () => {
    try {
        // Validate selections
        if (!selectDesignation.value || !selectStatus.value) {
            alert("Please select both designation and status");
            return;
        }

        // Show loading state
        showLoading(true);

        // Fetch report data
        let datalist = getServiceRequest("/reportUser/bydesignationstatus?designation_id=" + selectDesignation.value + "&employeestatus_id=" + selectStatus.value);

        // Get configuration for this report
        let config = REPORT_CONFIGURATIONS.userReport;

        // Transform data using configuration
        let reportDataList = transformDataToObjects(datalist, config.dataMapping);

        // Get column definitions from configuration
        let columns = getColumnDefinitions(config.dataMapping);

        // Fill the report table
        fillReportTable(tHeadUserReport, tBodyUserReport, reportDataList, columns);

    } catch (error) {
        console.error("Error generating report:", error);
        alert("Error generating report. Please try again.");
    } finally {
        showLoading(false);
    }
};

// Enhanced table filling function
const fillReportTable = (tHeadId, tBodyId, datalist, columnList) => {
    // Clear existing content
    tHeadId.innerHTML = "";
    tBodyId.innerHTML = "";

    // Handle empty data
    if (!datalist || datalist.length === 0) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = columnList.length + 1;
        noDataCell.textContent = 'No data available';
        noDataCell.className = 'text-center text-muted';
        noDataRow.appendChild(noDataCell);
        tBodyId.appendChild(noDataRow);
        return;
    }

    // Create header row
    const headerRow = document.createElement('tr');

    // Add index header
    const indexHeader = document.createElement("th");
    indexHeader.textContent = "#";
    indexHeader.className = "text-center";
    headerRow.appendChild(indexHeader);

    // Add column headers
    columnList.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.label || formatHeaderText(column.property);
        headerRow.appendChild(th);
    });

    tHeadId.appendChild(headerRow);

    // Create table body rows
    datalist.forEach((dataObj, index) => {
        const row = document.createElement("tr");

        // Add index cell
        const indexCell = document.createElement("td");
        indexCell.textContent = index + 1;
        indexCell.className = "text-center";
        row.appendChild(indexCell);

        // Add data cells
        columnList.forEach(column => {
            const cell = document.createElement("td");

            switch (column.dataType) {
                case "string":
                    cell.textContent = formatCellValue(dataObj[column.property]);
                    break;
                case "function":
                    cell.innerHTML = column.property(dataObj);
                    break;
                case "decimal":
                    cell.textContent = formatDecimal(dataObj[column.property]);
                    break;
                default:
                    cell.textContent = formatCellValue(dataObj[column.property]);
            }

            row.appendChild(cell);
        });

        tBodyId.appendChild(row);
    });
};

// Helper function to format header text
const formatHeaderText = (text) => {
    return text
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper function to format cell values
const formatCellValue = (value) => {
    if (value == null || value == undefined) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value).trim();
};

// Helper function to format decimal values
const formatDecimal = (value) => {
    if (value == null || value == undefined || isNaN(value)) {
        return '';
    }
    return Number(value).toFixed(2);
};

// Helper function to show/hide loading state
const showLoading = (isLoading) => {
    // Assuming you have a loading element
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'block' : 'none';
    }
};

// Enhanced dropdown filling function (if not already defined)
const fillDropdown = (selectElement, placeholder, dataList, valueProperty) => {
    // Clear existing options
    selectElement.innerHTML = "";

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectElement.appendChild(placeholderOption);

    // Add data options
    dataList.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id || item.value;
        option.textContent = item[valueProperty] || item.name || item.label;
        selectElement.appendChild(option);
    });
};

// Add event listeners for real-time filtering (optional)
const initializeEventListeners = () => {
    // Auto-generate report when both dropdowns are selected
    selectDesignation.addEventListener('change', checkAndGenerateReport);
    selectStatus.addEventListener('change', checkAndGenerateReport);
};

const checkAndGenerateReport = () => {
    if (selectDesignation.value && selectStatus.value) {
        generateReport();
    }
};

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeEventListeners);