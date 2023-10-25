// content.js

function getAuthCookie() {
    const cookieList = document.cookie.split(";");
    const cookieName = "PSAAuthToken=";

    for (let i = 0; i < cookieList.length; i++) {
        const cookie = cookieList[i].trim();

        if (cookie.startsWith(cookieName)) {
            return cookie.substring(name.length + cookieName.length);
        }
    }

    return null;
}

function extractTicketLinkData() {
    const currentURL = window.location.href;

    const regex = /(\d+)$/;
    const match = currentURL.match(regex);

    if (match) {
        if (currentURL.includes("/tickets/")) {
            return ["tickets/", match[1]];
        } else if (currentURL.includes("/mytickets/")) {
            return ["mytickets/", match[1]];
        }
    } else {
        return null;
    }
}

let ticketNotesJSON = null;
function getTicketNotes() {
    const ticketLinkData = extractTicketLinkData();
    const authToken = getAuthCookie();
    const apiLink = `https://abc.example.com/api/desk/tickets/${ticketLinkData[1]}/activities?Filter.ActivityType=&Filter.OnlyInternal=false&Sort=&Exclude=&PageSize=25&PageNumber=1`

    if (!authToken) { return; }

    fetch(apiLink, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer " + getAuthCookie(),
            "cache-control": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": `https://abc.example.com/desk/${ticketLinkData[0] + ticketLinkData[1]}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Something went terribly wrong. ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            ticketNotesJSON = data;
        })
        .catch(error => {
            console.error(error);
        });
}

function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function formatTicketNotes(jsonData) {
    if (!jsonData) {
        return "";
    }

    let formattedNotes = "";

    for (let i = 0; i < jsonData.result.length; i++) {
        const note = jsonData.result[i];

        const activityType = note.activityType;
        const createdBy = note.createdByName;
        const createdOn = note.createdOn;
        const internalNotes = note.internalNotes;
        const publicNotes = note.notes;
        const startTime = note.startTime;
        const endTime = note.endTime;
        const timeSpent = note.timeSpent;

        if (activityType == "Time Logged") {
            formattedNotes += `Activity Type: ${activityType}\n`;
            formattedNotes += `Created By: ${createdBy}\n`;
            formattedNotes += `Created On: ${createdOn}\n`;
            formattedNotes += `Start Time: ${startTime}\n`;
            formattedNotes += `End Time: ${endTime} (${timeSpent})\n`;

            if (internalNotes) {
                formattedNotes += `Internal Notes:\n\n${stripHTML(internalNotes)}\n\n`;
            }

            if (publicNotes) {
                formattedNotes += `Public Notes:\n\n${stripHTML(publicNotes)}\n\n`;
            }

            formattedNotes += "-----\n";
        } else if (activityType == "Email Sent") {
            formattedNotes += `Activity Type: ${activityType}\n`;
            formattedNotes += `Created By: ${createdBy}\n`;
            formattedNotes += `Created On: ${createdOn}\n`;

            if (internalNotes) {
                formattedNotes += `Internal Notes:\n\n${stripHTML(internalNotes)}\n\n`;
            }

            if (publicNotes) {
                formattedNotes += `Public Notes:\n\n${stripHTML(publicNotes)}\n\n`;
            }

            formattedNotes += "-----\n";
        } else if (activityType == "Status Changed") {
            formattedNotes += `Activity Type: ${activityType}\n`;
            formattedNotes += `Changed By: ${createdBy}\n`;
            formattedNotes += `Changed On: ${createdOn}\n`;
            formattedNotes += `From: ${note.notes}\n`;
            formattedNotes += `To: ${note.internalNotes}\n`;
            
            formattedNotes += "-----\n";
        } else {
            formattedNotes += "The following note could not be formatted:\n\n"
            formattedNotes += `Activity Type: ${activityType}\n`;
            formattedNotes += `Created By: ${createdBy}\n`;
            formattedNotes += `Created On: ${createdOn}\n`;

            if (internalNotes) {
                formattedNotes += `Internal Notes:\n\n${internalNotes}\n\n`;
            }

            if (publicNotes) {
                formattedNotes += `Public Notes:\n\n${publicNotes}\n\n`;
            }

            formattedNotes += "-----\n";
        }
    }

    return formattedNotes;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        alert("Copied to clipboard!");
    })
    .catch(function (error) {
        alert("Failed to copy to clipboard.");
    });
}

function addExportButton(exportElement) {
    const list = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = "Export Ticket Activity";

    button.style.border = "none";
    button.style.backgroundColor = "#125987";
    button.style.color = "white";
    button.style.padding = "10px"
    button.style.marginTop = "32px";
    button.style.width = "100%";

    button.addEventListener("click", function (event) {
        event.preventDefault();

        if (!ticketNotesJSON) {
            alert("No ticket notes, try refreshing the page.");
            return;
        }

        copyToClipboard(formatTicketNotes(ticketNotesJSON));
        
    });

    const exportElementLength = exportElement.children.length;
    const index = exportElementLength - 2;

    exportElement.children[index].after(list);
    list.appendChild(button);
}

let psaSearchableItemsHeader = null;
async function initialize() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.message === "urlChanged") {
            getTicketNotes();
        }
    });

    let attempts = 0;

    while (!psaSearchableItemsHeader) {
        psaSearchableItemsHeader = document.querySelector('ul.sidebar-menu.tree');

        if (!psaSearchableItemsHeader) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        attempts++;

        if (attempts > 10) {
            return;
        }
    }

    if (psaSearchableItemsHeader) {
        addExportButton(psaSearchableItemsHeader);
    }
}

initialize();
