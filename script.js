"use strict";

const endpoint = "http://localhost:8080/ordbogen";

window.addEventListener("load", start);

let requestsCount = 0;
let totalTime = 0;

function start(){
    console.log("Script running...");
    document.getElementById("search-btn").addEventListener("click", searchBtnClick)
}

async function searchBtnClick(e){
    e.preventDefault();
    console.log("Search button clicked");
    console.log("User Input:", getUserInput());
    document.getElementById("show-result").classList.add("hidden");
    document.getElementById("message").classList.add("hidden");
    showResult(await getResult(getUserInput()));
}

function getUserInput(){
    console.log("Getting user input");
    const form = document.getElementById("search-form");
    const input = form.elements["search"].value;
    return input;
}

function showResult(result){
    if(result === -1){
        console.log("Word not found.", result);
        document.getElementById("message").textContent = "Søgning ikke fundet...";
    } else {
        console.log("Workd found!:", result);
        document.getElementById("message").textContent = "Søgning fundet!";
        document.getElementById("tot-time-span").textContent = totalTime;
        document.getElementById("inflected").textContent = result.inflected;
        document.getElementById("headword").textContent = result.headword;
        document.getElementById("part-of-speech").textContent = result.partofspeech;
        document.getElementById("homografnr-span").textContent = result.homograph;
        document.getElementById("id-span").textContent = result.id;
        document.getElementById("show-result").classList.remove("hidden");

    }
    document.getElementById("message").classList.remove("hidden");
}

async function getResult(userInput){
    const sizes = await getSizes();
    requestsCount = 0;
    let minIndex = sizes.min;
    let maxIndex = sizes.max;
    let midIndex;
    let midEntry;

    const startTime = performance.now();

    while(minIndex <= maxIndex){
        requestsCount++;
        const currentTime = performance.now();
        totalTime = ((currentTime - startTime) / 1000).toFixed(3);
        document.getElementById("req-amount-span").textContent = requestsCount;
        midIndex = Math.floor((minIndex + maxIndex) / 2);
        midEntry = await getEntryAt(midIndex);
        const comp = userInput.localeCompare(midEntry.inflected);

        if(comp === 0){
            console.log("Request count:", requestsCount);
            return midEntry;
        } else if (comp > 0){
            minIndex = midIndex + 1;
        } else {
            maxIndex = midIndex - 1;
        }
    }
    console.log("Request count:", requestsCount);
    return -1
}

//Backend api requests
async function getSizes() {
    console.log("Fetching size...");
    const json = await fetch(endpoint).then((response) => response.json());
    return json;
}

async function getEntryAt(index) {
    console.log("Fetching entry at index:", index);
    const entry = await fetch(`${endpoint}/${index}`).then(resp => resp.json());
    return entry;
}


