// ==========================
// IMAGE THRESHOLDING
// ==========================

const imageInput = document.getElementById("imageInput");

const beforeImage = document.getElementById("beforeImage");

const afterImage = document.getElementById("afterImage");

const thresholdSlider =
document.getElementById("thresholdSlider");
// ambil threshold default
const sliderValue =
document.getElementById("sliderValue");

const savedDefault =
localStorage.getItem(
    "defaultThreshold"
);

if(savedDefault){

    thresholdSlider.value =
    savedDefault;

    sliderValue.textContent =
    savedDefault;

}
const savedThreshold =
localStorage.getItem(
    "defaultThreshold"
);

if(savedThreshold){

    thresholdSlider.value =
    savedThreshold;

    sliderValue.textContent =
    savedThreshold;
}

const thresholdType =
document.getElementById("thresholdType");


// UPDATE SLIDER VALUE
if(thresholdSlider){

    thresholdSlider.addEventListener("input", () => {

        sliderValue.textContent =
        thresholdSlider.value;

        applyThreshold();

    });

}


// UPLOAD IMAGE
if(imageInput){

    imageInput.addEventListener("change", function(e){

        const file = e.target.files[0];

        if(file){

            const imageURL =
            URL.createObjectURL(file);

            // tampilkan di before preview
            beforeImage.src = imageURL;

            beforeImage.onload = () => {

                applyThreshold();

            };

        }

    });

}


// CHANGE THRESHOLD TYPE
if(thresholdType){

    thresholdType.addEventListener(
        "change",
        applyThreshold
    );

}


// ==========================
// THRESHOLD FUNCTION
// ==========================

function applyThreshold(){

    if(!beforeImage.src) return;

    // baca gambar
    let src = cv.imread(beforeImage);

    // grayscale
    let gray = new cv.Mat();

    cv.cvtColor(
        src,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    let dst = new cv.Mat();

    const value =
    parseInt(thresholdSlider.value);

    const type =
    thresholdType.value;


    // ======================
    // BINARY THRESHOLD
    // ======================

    if(type === "binary"){

        cv.threshold(
            gray,
            dst,
            value,
            255,
            cv.THRESH_BINARY
        );

    }


    // ======================
    // BINARY INVERSE
    // ======================

    else if(type === "binaryInv"){

        cv.threshold(
            gray,
            dst,
            value,
            255,
            cv.THRESH_BINARY_INV
        );

    }


    // ======================
    // ADAPTIVE THRESHOLD
    // ======================

    else if(type === "adaptive"){

        cv.adaptiveThreshold(
            gray,
            dst,
            255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY,
            11,
            2
        );

    }


    // tampilkan hasil
    cv.imshow("canvasOutput", dst);

    afterImage.src =
    document
    .getElementById("canvasOutput")
    .toDataURL();


    // hapus memory
    src.delete();
    gray.delete();
    dst.delete();

}

// ==========================
// SIDEBAR NAVIGATION
// ==========================

// BUTTONS
const homeBtn = document.getElementById("homeBtn");

const thresholdBtn =
document.getElementById("thresholdBtn");

const historyBtn =
document.getElementById("historyBtn");

const settingsBtn =
document.getElementById("settingsBtn");

const logoutBtn =
document.getElementById("logoutBtn");


// SECTIONS
const homeSection =
document.getElementById("homeSection");

const thresholdSection =
document.getElementById("thresholdSection");

const historySection =
document.getElementById("historySection");

const settingsSection =
document.getElementById("settingsSection");


// MENU ITEMS
const menuItems =
document.querySelectorAll(".menu li");


// ==========================
// SHOW SECTION
// ==========================

function showSection(section){

    // hide all
    homeSection.style.display = "none";

    thresholdSection.style.display = "none";

    historySection.style.display = "none";

    settingsSection.style.display = "none";

    // show selected
    section.style.display = "block";

}


// ==========================
// REMOVE ACTIVE
// ==========================

function removeActive(){

    menuItems.forEach(item => {

        item.classList.remove("active");

    });

}


// ==========================
// HOME BUTTON
// ==========================

if(homeBtn){

    homeBtn.addEventListener("click", () => {

        removeActive();

        homeBtn.classList.add("active");

        showSection(homeSection);

    });

}


// ==========================
// THRESHOLD BUTTON
// ==========================

if(thresholdBtn){

    thresholdBtn.addEventListener("click", () => {

        removeActive();

        thresholdBtn.classList.add("active");

        showSection(thresholdSection);

    });

}


// ==========================
// HISTORY BUTTON
// ==========================

if(historyBtn){

    historyBtn.addEventListener("click", () => {

        removeActive();

        historyBtn.classList.add("active");

        showSection(historySection);

    });

}


// ==========================
// SETTINGS BUTTON
// ==========================

if(settingsBtn){

    settingsBtn.addEventListener("click", () => {

        removeActive();

        settingsBtn.classList.add("active");

        showSection(settingsSection);

    });

}

// ==========================
// ACTION BUTTONS
// ==========================

const applyBtn =
document.getElementById("applyBtn");

const resetBtn =
document.getElementById("resetBtn");

const saveBtn =
document.getElementById("saveBtn");


// APPLY BUTTON
if(applyBtn){

    applyBtn.addEventListener("click", () => {

        applyThreshold();

        saveHistory();

    });

}


// RESET BUTTON
if(resetBtn){

    resetBtn.addEventListener("click", () => {

        thresholdSlider.value = 127;

        sliderValue.textContent = 127;

        thresholdType.value = "binary";

        if(beforeImage.src){

            afterImage.src = beforeImage.src;

        }

    });

}

// SAVE BUTTON
if(saveBtn){

    saveBtn.addEventListener("click", () => {

        if(!afterImage.src) return;

        const link =
        document.createElement("a");

        link.href = afterImage.src;

        link.download = "threshold-image.png";

        link.click();

    });

}

// ==========================
// HISTORY FUNCTION
// ==========================

const historyContainer =
document.getElementById("historyContainer");

function saveHistory(){

    if(!afterImage.src) return;

    const historyData = {

        image: afterImage.src,

        type: thresholdType.value,

        time: new Date().toLocaleString()

    };

    let histories =
    JSON.parse(
        localStorage.getItem("thresholdHistory")
    ) || [];

    histories.unshift(historyData);

    localStorage.setItem(
        "thresholdHistory",
        JSON.stringify(histories)
    );

    loadHistory();

}

function loadHistory(){

    if(!historyContainer) return;

    historyContainer.innerHTML = "";

    let histories =
    JSON.parse(
        localStorage.getItem("thresholdHistory")
    ) || [];

    histories.forEach(item => {

        const historyCard =
        document.createElement("div");

        historyCard.classList.add("history-card");

        historyCard.innerHTML = `

            <img src="${item.image}">

            <div class="history-info">

                <h3>Threshold Result</h3>

                <p>${item.type}</p>

                <p>${item.time}</p>

            </div>

        `;

        historyContainer.appendChild(historyCard);

    });

}

// ==========================
// THEME SETTINGS
// ==========================

const themeSelect =
document.getElementById("themeSelect");

if(themeSelect){

    // load theme yang tersimpan
    const savedTheme =
    localStorage.getItem("theme");

    if(savedTheme){

        themeSelect.value =
        savedTheme;

    }

    applyTheme(themeSelect.value);

    themeSelect.addEventListener(
        "change",
        function(){

            localStorage.setItem(
                "theme",
                this.value
            );

            applyTheme(this.value);

        }
    );

}

function applyTheme(theme){

    if(theme === "light"){

        document.body.classList.add(
            "light-mode"
        );

        document.documentElement.style.setProperty(
            "--bg-main",
            "#f5f5f5"
        );

        document.documentElement.style.setProperty(
            "--bg-card",
            "#ffffff"
        );

        document.documentElement.style.setProperty(
            "--text-color",
            "#111111"
        );

    }

    else{

        document.body.classList.remove(
            "light-mode"
        );

        document.documentElement.style.setProperty(
            "--bg-main",
            "#0d0d0d"
        );

        document.documentElement.style.setProperty(
            "--bg-card",
            "#1a1a1a"
        );

        document.documentElement.style.setProperty(
            "--text-color",
            "#ffffff"
        );

    }

}


// ==========================
// CLEAR HISTORY
// ==========================

const clearHistoryBtn =
document.getElementById("clearHistoryBtn");

if(clearHistoryBtn){

    clearHistoryBtn.addEventListener(
        "click",
        function(){

            localStorage.removeItem(
                "thresholdHistory"
            );

            historyContainer.innerHTML = "";

            alert("History berhasil dihapus");

        }
    );

}

// ==========================
// DEFAULT THRESHOLD
// ==========================

const defaultThreshold =
document.getElementById(
    "defaultThreshold"
);

const defaultValue =
document.getElementById(
    "defaultValue"
);
if(defaultThreshold){

    const savedDefault =
    localStorage.getItem(
        "defaultThreshold"
    );

    if(savedDefault){

        defaultThreshold.value =
        savedDefault;

        defaultValue.textContent =
        savedDefault;

    }

    defaultThreshold.addEventListener(
        "input",
        function(){

            defaultValue.textContent =
            this.value;

            localStorage.setItem(
                "defaultThreshold",
                this.value
            );

        }
    );

}
// ==========================
// LOAD HISTORY
// ==========================

loadHistory();