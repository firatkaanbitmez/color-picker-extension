// Elements
const form = document.getElementById('options-form');
const defaultColorFormatSelect = document.getElementById('default-color-format');
const enableNotificationsCheckbox = document.getElementById('enable-notifications');
const statusMessage = document.getElementById('status');

// Load saved options when the options page is opened
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['defaultColorFormat', 'enableNotifications'], (options) => {
        if (options.defaultColorFormat) {
            defaultColorFormatSelect.value = options.defaultColorFormat;
        }
        if (options.enableNotifications) {
            enableNotificationsCheckbox.checked = options.enableNotifications;
        }
    });
});

// Save options when the form is submitted
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const defaultColorFormat = defaultColorFormatSelect.value;
    const enableNotifications = enableNotificationsCheckbox.checked;

    chrome.storage.sync.set({
        defaultColorFormat,
        enableNotifications
    }, () => {
        // Show status message
        statusMessage.textContent = 'Options saved!';
        setTimeout(() => {
            statusMessage.textContent = '';
        }, 2000);
    });
});
