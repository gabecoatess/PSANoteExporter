# PSA Ticket Note Export Chrome Extension

![Version](https://img.shields.io/badge/Version-0.1.0-brightgreen)

## Overview

Our company is in the process of switching from one PSA system to another, which involves a lot of work and adjustments in how we organize and structure our projects. The challenge we faced was migrating ticket notes from the old PSA system to the new one, as there was no built-in export/import feature. The old PSA system used CSS formatting for ticket information, making direct copy-pasting messy.

To tackle this issue, I have created a Chrome extension, "Note Exporter," to simplify the process of exporting and importing ticket notes in our new PSA system. This extension allows you to extract and format ticket notes, making them easier to transition to the new system.

[Check out my blog post on this extension!](https://gabecoatess.com/2023/10/25/psa-ticket-note-export-extension/)

## Gathering Request Data

The extension retrieves PSA ticket notes using a GET request to the API. It fetches data based on the specific ticket's ID and the user's authentication token. To access the data, we need to extract the ticket ID and determine if the ticket is assigned to the user or not. The API link is constructed with the extracted ticket ID.

## Format and Export

After fetching the ticket notes in JSON format, the extension proceeds to format the data. The formatted notes include details such as the activity type, created by, created on, and the actual notes. The format is user-friendly and designed to be easily imported into the new PSA system. Please ensure that your PSA system and ticket notes have those values in the JSON.

## Copy to Clipboard

Once the notes are formatted, the extension allows you to copy the formatted content to your clipboard with a single click. This makes it convenient for you to paste the information into the new PSA system's project or ticket notes.

## Installation

1. Clone or download this repository.
2. Open the Chrome browser.
3. Go to chrome://extensions/ in the address bar.
4. Enable "Developer mode" in the top right corner.
5. Click the "Load unpacked" button.
6. Select the directory where you cloned or downloaded this repository.

## Usage

1. Log in to your PSA system.
2. Open a ticket.
3. Click the "Export Ticket Activity" button, which will appear on the page.
4. The ticket notes will be formatted and copied to your clipboard.
5. You can now paste the formatted notes into your new PSA system.

## Note
- The extension is heavily designed to work with a specific PSA system and WILL require modifications for other systems.
- Ensure you are logged in and have the necessary permissions to access ticket data.

## License

This extension is released under the MIT License.
- You are free to use, modify, and distribute this extension for personal or commercial purposes.
- Attribution: You must include the original MIT License and copyright notice when distributing the extension.
- No Warranty: The extension is provided "as is" without any warranty.

For the full text of the MIT License, refer to the [LICENSE](LICENSE.md) file in this repository.
---

Enjoy using the ticket note exporter for a smoother transition to your new PSA system!
If you have any questions or encounter issues, please feel free to [reach out to me through email.](mailto:gabrielrcoates@outlook.com)
