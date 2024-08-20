const colorPickerBtn = document.querySelector("#color-picker");
const clearAllBtn = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");
let defaultColorFormat = 'hex'; // Default format is HEX
let enableNotifications = false; // Default is no notifications

// Load saved options from chrome.storage
const loadOptions = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['defaultColorFormat', 'enableNotifications'], (options) => {
      defaultColorFormat = options.defaultColorFormat || 'hex';
      enableNotifications = options.enableNotifications || false;
      resolve(); // Ensure options are fully loaded
    });
  });
};

// Function to copy color to clipboard
const copyColor = (elem) => {
  const colorValue = elem.dataset.color;
  navigator.clipboard.writeText(colorValue);
  
  // Optionally show a notification
  if (enableNotifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Color Copied",
      message: `${colorValue} has been copied to your clipboard.`
    });
  }

  elem.innerText = "Copied!";
  setTimeout(() => (elem.innerText = colorValue), 1000);
};

// Show picked colors
const showColors = () => {
  if (!pickedColors.length) return;
  
  colorList.innerHTML = pickedColors
    .map(
      (color) => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${
        color === "#ffffff" ? "#ccc" : color
      }"></span>
            <span class="value" data-color="${color}">${formatColor(color)}</span>
        </li>
      `
    )
    .join("");

  document.querySelector(".picked-colors").classList.remove("hide");

  document.querySelectorAll(".color span").forEach((elem) => {
    elem.addEventListener("click", (e) => copyColor(e.currentTarget));
  });
};

// Format the color based on user preference (HEX or RGB)
const formatColor = (color) => {
  if (defaultColorFormat === 'rgb') {
    return hexToRgb(color);
  }
  return color;
};

// Convert HEX to RGB format
const hexToRgb = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

// Activate the color picker
const activateEyeDropper = async () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColors();
      }
    } catch (error) {
      alert("Failed to pick the color!");
    }
    document.body.style.display = "block";
  }, 10);
};

// Clear all picked colors
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

// Load options and then initialize event listeners
loadOptions().then(() => {
  clearAllBtn.addEventListener("click", clearAllColors);
  colorPickerBtn.addEventListener("click", activateEyeDropper);
  showColors();
});

window.oncontextmenu = function () {
  return false;
};

document.addEventListener(
  "keydown",
  function (event) {
    const key = event.key || event.keyCode;
    if (key === 123) {
      return false;
    } else if (
      (event.ctrlKey && event.shiftKey && key === 73) ||
      (event.ctrlKey && event.shiftKey && key === 74)
    ) {
      return false;
    }
  },
  false
);
