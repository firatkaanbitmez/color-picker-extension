const colorPickerBtn = document.querySelector("#color-picker");
const clearAllBtn = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

const copyColor = (elem) => {
  elem.innerText = "Copied!";
  navigator.clipboard.writeText(elem.dataset.color);
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

const showColors = () => {
  if (!pickedColors.length) return;

  colorList.innerHTML = pickedColors
    .map(
      (color) => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${
        color === "#ffffff" ? "#ccc" : color
      }"></span>
            <span class="value" data-color="${color}">${color}</span>
        </li>
      `
    )
    .join("");

  document.querySelector(".picked-colors").classList.remove("hide");

  document.querySelectorAll(".color span").forEach((elem) => {
    elem.addEventListener("click", (e) => copyColor(e.currentTarget));
  });
};

showColors();

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

const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

clearAllBtn.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);

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
