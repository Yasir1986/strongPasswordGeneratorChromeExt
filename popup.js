const passwordDisplay = document.querySelector(".password");
const copyBtn = document.querySelector(".copy-btn");
const slider = document.querySelector("#slider-length");
const lengthValue = document.querySelector(".length-value");

const upper = document.querySelector(".uppercase");
const lower = document.querySelector(".lowercase");
const numbers = document.querySelector(".numbers");
const symbols = document.querySelector(".symbols");

const generateBtn = document.querySelector(".generate-btn");
const toast = document.querySelector(".toast");

const strengthFill = document.querySelector(".strength-fill");
const strengthText = document.querySelector(".strength-text");

const themeToggle = document.querySelector(".theme-toggle");

const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const L = "abcdefghijklmnopqrstuvwxyz";
const N = "0123456789";
const S = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

const getRandomChar = (chars) => {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return chars[arr[0] % chars.length];
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    const j = r[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const updateStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  let percent = 25, color = "#ef4444", text = "Weak";
  if (score >= 4) { percent = 60; color = "#f59e0b"; text = "Medium"; }
  if (score >= 6) { percent = 100; color = "#22c55e"; text = "Strong"; }

  strengthFill.style.width = percent + "%";
  strengthFill.style.background = color;
  strengthText.textContent = text;
};

const generatePassword = () => {
  const length = +slider.value;
  let pool = "";
  let chars = [];

  if (upper.checked) { pool += U; chars.push(getRandomChar(U)); }
  if (lower.checked) { pool += L; chars.push(getRandomChar(L)); }
  if (numbers.checked) { pool += N; chars.push(getRandomChar(N)); }
  if (symbols.checked) { pool += S; chars.push(getRandomChar(S)); }

  if (!pool) {
    passwordDisplay.value = "Select options";
    return;
  }

  while (chars.length < length) {
    chars.push(getRandomChar(pool));
  }

  const password = shuffle(chars).join("");
  passwordDisplay.value = password;
  updateStrength(password);
};

// ====================
// LINKEDIN BUTTON HANDLER
// ====================
const linkedinBtn = document.getElementById("linkedin-btn");
if (linkedinBtn) {
  linkedinBtn.addEventListener("click", function(e) {
    e.stopPropagation(); // Keep popup open
    e.preventDefault(); // Prevent default
    
    const linkedinUrl = "https://www.linkedin.com/in/yasir-akbar-2b534513b/";
    
    // Open LinkedIn in new tab
    chrome.tabs.create({ 
      url: linkedinUrl,
      active: true 
    });
  });
}

// ====================
// EXISTING FUNCTIONALITY
// ====================
generateBtn.addEventListener("click", generatePassword);

slider.addEventListener("input", () => {
  lengthValue.textContent = slider.value;
  generatePassword();
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordDisplay.value).then(() => {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  });
});

const setTheme = (t) => {
  document.body.classList.toggle("light", t === "light");
  themeToggle.textContent = t === "light" ? "🌞" : "🌙";
  localStorage.setItem("theme", t);
};

themeToggle.addEventListener("click", () => {
  setTheme(localStorage.getItem("theme") === "light" ? "dark" : "light");
});

// Initialize
setTheme(localStorage.getItem("theme") || "dark");
lengthValue.textContent = slider.value;
generatePassword();