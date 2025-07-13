window.addEventListener("load", () => {
    moduleList = getServiceRequest("/modulewithoutuserprivi");
    for (const module of moduleList) {
        $(`.${module.name}`).css("display", "none");
    }

    $(`.${viewDashboard}`).css("display", "none");
})