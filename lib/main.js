import prompts from "prompts";
(async () => {
    const response = await prompts([
        {
            type: 'confirm',
            name: 'value',
            message: 'this is step one, would you like to continue?',
            initial: true
        },
        {
            type: "text",
            name: "oneTimeCode",
            message: "enter one time code",
        },
        {
            type: "multiselect",
            name: "color",
            message: "Pick colors",
            choices: [
                { title: "Red", value: "#ff0000" },
                { title: "Green", value: "#00ff00" },
                { title: "Blue", value: "#0000ff" },
            ],
        },
    ]);
    console.log(response);
})();
//# sourceMappingURL=main.js.map