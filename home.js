(async () => {
    function save(key, value) {
        browser.storage.local.set({
            [key]: value
        }).then(() => {
            console.log("Settings saved!", key, value);
        });
    }


    async function load(key, defaultValue){
        const result = await browser.storage.local.get({ [key]: defaultValue });
        console.log("Settings loaded!", key, defaultValue, result[key]);
        return result[key]
    };

    let startbrightness = await load("brightness", .95)

    let background = document.getElementById("background")
    background.style.filter = "brightness("+startbrightness+")"
    background.style.backgroundSize = "cover"

    let sliderOpacity = document.getElementById("bgOpacity")
    function updateOpacity(){
        background.style.filter = "brightness("+sliderOpacity.value/100+")"
    }
    sliderOpacity.value = startbrightness*100
    updateOpacity()
    sliderOpacity.onchange = () => {
        save("brightness", sliderOpacity.value/100)
        updateOpacity()
    }

    let timeElement = document.getElementById("time")
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        timeElement.textContent = timeString
    }, .25)
    let timeSizeElement = document.getElementById("timeSize")
    timeSizeElement.value = await load("timesize", 75)
    async function updateTimeSize(){
        timeElement.style.fontSize = await load("timesize", 75)+"px"
    }
    timeSizeElement.onchange = () => {
        save("timesize", timeSizeElement.value)
        updateTimeSize()
    }
    updateTimeSize()


    let sizeBox = document.getElementById("size")
    function updateSize(){
        if (sizeBox.checked == true) {
            background.style.backgroundSize = "cover"
        }
        else{
            background.style.backgroundSize = "auto"
        }
    }
    sizeBox.checked = await load("size", true)
    sizeBox.onchange = () => {
        save("size", sizeBox.checked)
        updateSize()
    }
    updateSize()
    

    browser.theme.getCurrent().then(theme => {
        console.log("Current theme:", theme);
        background.style.backgroundColor = theme.colors.frame
        try {
            bgImage = theme.images.additional_backgrounds[0]
            background.style.backgroundImage = "url(\""+bgImage+"\")"
        } catch (error) {
            try {
                bgImage = theme.images.theme_frame
                background.style.backgroundImage = "url(\""+bgImage+"\")"
                console.log(bgImage)
            } catch (error) {
                console.log("No BG Found")
            }
        }
        timeElement.style.color = theme.colors.sidebar_text
        
    });

    browser.theme.onUpdated.addListener((updateInfo) => {
        window.location.reload()
    });

})()