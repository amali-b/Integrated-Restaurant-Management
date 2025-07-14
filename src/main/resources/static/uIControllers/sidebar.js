window.addEventListener("load", () => {
    moduleList = getServiceRequest("/modulewithoutuserprivi");
    console.log(moduleList);

    for (const module of moduleList) {
        $(`.${module.name}`).css("display", "none");
    }
})