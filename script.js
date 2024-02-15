'use strict';

// --------------------------------------------------------------
// Select elements

const capybaraBtnEl = document.querySelector('.capybara');
const scoreEl = document.querySelector('.score');
const resetBtnEl = document.querySelector('.reset-btn ');
const connectBtnEl = document.querySelector('.connect-btn');

// items
const autoClickEl = document.querySelector('.auto-click');
const upgradeCursorEl = document.querySelector('.upgrade-cursor');
const boostEl = document.querySelector('.boost');
const newSkinEl = document.querySelector('.new-skin');
const magicPotionEl = document.querySelector('.magic-potion');

// --------------------------------------------------------------
// Variables
// let userNickname = prompt(`Enter your Nickname`);
// setUserNickname();

let score = 0;
let pointsPerClick = 1;
let multiplier = 1;
let autoPoints = 0;
let capybaraSkin = 1;
let intervalId;

const items = [autoClickEl, upgradeCursorEl, boostEl, newSkinEl, magicPotionEl];

// --------------------------------------------------------------
// Functions

// function setUserNickname() {
//   if (userNickname) {
//     nicknameEl.textContent = userNickname;
//   } else {
//     nicknameEl.textContent = 'Anonymous';
//   }
// }

async function switchToBlastSepoliaNetwork() {
  try {
    // Convert the decimal chain ID to hexadecimal
    const chainIdHex = '0x' + parseInt(168587773).toString(16);

    // Parameters for the Blast Sepolia Network
    const blastSepoliaParams = {
      chainId: chainIdHex, // Hexadecimal string of the chain ID, prefixed with 0x
      chainName: 'Blast Sepolia',
      nativeCurrency: {
        name: 'Ethereum', // Name of the native currency
        symbol: 'ETH', // Symbol of the native currency
        decimals: 18, // Decimal precision of the native currency
      },
      rpcUrls: ['https://sepolia.blast.io'], // Array of RPC URLs
      blockExplorerUrls: ['https://168587773.testnet.testnet.routescan.io'], // Array of block explorer URLs
    };

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [blastSepoliaParams],
    });
  } catch (error) {
    console.error('Failed to switch to the Blast Sepolia Network:', error);
  }
}

function shortenAddress(address) {
  const firstPart = address.slice(0, 6); // Take the first 6 characters
  const lastPart = address.slice(-5); // Take the last 4 characters
  return `${firstPart}...${lastPart}`; // Concatenate with ellipsis in the middle
}

const increaseScore = function () {
  score += pointsPerClick;
  scoreEl.textContent = score;
};

const resetButtonsStyle = function () {
  for (let i = 0; i < items.length; i++) items[i].classList.remove('bought');
};

const resetGame = function () {
  score = 0;
  pointsPerClick = 1;
  multiplier = 1;
  autoPoints = 0;
  capybaraSkin = 1;
  capybaraBtnEl.src = `img/capy_${capybaraSkin}.png`;

  clearInterval(intervalId); // Clear the interval using the stored interval ID
  intervalId = null; // Reset the intervalId variable

  resetButtonsStyle();
  console.log('reset');

  scoreEl.textContent = score;
};

const upgradeCursor = function () {
  pointsPerClick++;
  upgradeCursorEl.classList.add('bought');
};

const test = function () {
  autoPoints = 1;
  score += autoPoints;
  scoreEl.textContent = score;
  console.log(score);
};

const addAutoPoints = function () {
  if (intervalId) return; // Prevent multiple intervals if auto-click is clicked more than once
  intervalId = setInterval(test, 1000);
  autoClickEl.classList.add('bought');
};

const boost = function () {
  multiplier++;
  pointsPerClick *= multiplier;
  boostEl.classList.add('bought');
};

const updateSkin = function () {
  newSkinEl.classList.add('bought');
  capybaraSkin = 2;
  capybaraBtnEl.src = `img/capy_${capybaraSkin}.png`;
};

const magicPotion = function () {
  // ...
  magicPotionEl.classList.add('bought');
};

// --------------------------------------------------------------
// Game

// Click btn
capybaraBtnEl.addEventListener('click', increaseScore);

// Reset btn
resetBtnEl.addEventListener('click', resetGame);

// Items
autoClickEl.addEventListener('click', addAutoPoints);
upgradeCursorEl.addEventListener('click', upgradeCursor);
boostEl.addEventListener('click', boost);
newSkinEl.addEventListener('click', updateSkin);
magicPotionEl.addEventListener('click', magicPotion);

// Extend the connect button event listener to include network switching
connectBtnEl.addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      if (ethereum.selectedAddress) {
        console.log(ethereum.selectedAddress);
        const shortenedAddress = shortenAddress(ethereum.selectedAddress);
        connectBtnEl.textContent = shortenedAddress;

        // After successfully connecting, prompt to switch to the Blast Sepolia Network
        await switchToBlastSepoliaNetwork();
      }
    } catch (err) {
      console.error(err);
    }
  }
});

// --------------------------------------------------------------
