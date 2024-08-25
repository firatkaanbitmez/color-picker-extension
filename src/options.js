// Elements
const form = document.getElementById('options-form');
const defaultColorFormatSelect = document.getElementById('default-color-format');
const themeSelect = document.getElementById('theme-select');
const copyTypeSelect = document.getElementById('copy-type');
const statusMessage = document.getElementById('status');

// Load saved options when the options page is opened
document.addEventListener('DOMContentLoaded', () => {
    // Use chrome.storage.sync to retrieve saved settings
    chrome.storage.sync.get(['defaultColorFormat', 'theme', 'copyType'], (options) => {
        // Set the saved values in the UI elements
        if (options.defaultColorFormat) {
            defaultColorFormatSelect.value = options.defaultColorFormat;
        }
        if (options.theme) {
            themeSelect.value = options.theme;
            document.body.classList.toggle('light-theme', options.theme === 'light');
        }
        if (options.copyType) {
            copyTypeSelect.value = options.copyType;
        }
    });
});

// Save options when the form is submitted
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Collect the values from the form
    const defaultColorFormat = defaultColorFormatSelect.value;
    const theme = themeSelect.value;
    const copyType = copyTypeSelect.value;

    // Save the values in chrome.storage.sync
    chrome.storage.sync.set({
        defaultColorFormat,
        theme,
        copyType
    }, () => {
        // Apply the theme immediately
        document.body.classList.toggle('light-theme', theme === 'light');

        // Show status message
        statusMessage.textContent = 'Options saved!';
        setTimeout(() => {
            statusMessage.textContent = '';
        }, 2000);
    });
});
