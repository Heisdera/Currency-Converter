// getting required elements
const input = document.querySelector(".input");
const selections = document.querySelectorAll("select");
const baseCurrency = document.querySelector(".base select");
const targetCurrency = document.querySelector(".target select");
const button = document.getElementById("btn");
const result = document.querySelector(".result");
const swapBtn = document.querySelector(".swap");

const currencyCodes = Object.keys(currencyList); // obtaining only the key properties of the currencyList object which is the 162 currency codes

window.addEventListener("DOMContentLoaded", getExchangeRate); // getting the exchange rate once the app is opened (i.e on initial render)

button.addEventListener("click", getExchangeRate); // also getting the exchange rate once the get exchange rate button is clicked

// adding a click event that would swap the values of the target currency as the base currency and vice versa
swapBtn.addEventListener("click", e => {
  e.preventDefault(); // preventing default reload

  const firstCurrency = targetCurrency.value;
  targetCurrency.value = baseCurrency.value;
  baseCurrency.value = firstCurrency;

  getFlag(currencyCodes, targetCurrency);
  getFlag(currencyCodes, baseCurrency);

  getExchangeRate();
});

// creating a function to populate the select dropdown options which would contain the currencies list
function getCurrencyCode() {
  selections.forEach((selection, i) => {
    currencyCodes.forEach(currencyCode => {
      let selected; // creating a default selected option
      if (i === 0) {
        selected = currencyCode === "USD" ? "selected" : ""; // setting "USD" as the default selected option for the first select element(baseCurrency)
      } else {
        selected = currencyCode === "NGN" ? "selected" : ""; // setting "NGN" as the default selected option for the second select element(targetCurrency)
      }

      // creating the option element
      let option = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;

      selection.innerHTML += option; // appending all the currency code options elements to each select element
    });

    selection.addEventListener("change", e => {
      let selectEl = e.target;

      getFlag(currencyCodes, selectEl);
      getExchangeRate();
    });
  });
}
getCurrencyCode(); // calling the getCurrencyCode to populate the drop down list containing 162 currency codes

// creating a function that loads the various country flag that uses each currency
function getFlag(codes, element) {
  codes.forEach(code => {
    // a conditional statement that checks if the currency code matches the selected option
    if (code === element.value) {
      let img = element.previousElementSibling;

      let countryCode = currencyList[code]; // country code from the currency list

      img.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`; // using the country code in the img url to get the selected country flag
    }
  });
}

// creating a function that gets the latest exchange rate from exchangerate-api.com
function getExchangeRate() {
  let amount = input.value; // an amount variable gotten from the user's input value

  // a conditional statement that checks if that user did not pass in any amount or the amount passed is 0 then set the amount to 1 as the default value
  if (amount === "" || amount == "0") {
    input.value = 1;
    amount = 1;
  }

  result.innerHTML = `<div class="loader"></div>`; // setting a loading animation that displays while the exchange rate is being fetched

  const URL = `https://v6.exchangerate-api.com/v6/fb559c8619e7ba4daf04ba1a/latest/${baseCurrency.value}`;

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const currencyRates = data.conversion_rates[targetCurrency.value];

      let exchangeRate = (amount * currencyRates).toFixed(2); // multiplying the amount by the currency rate to get the total exchange rate

      // an early return statement that checks if the base currency is the same as the target currency then passing the amount the exchanged rate
      if (baseCurrency.value === targetCurrency.value) {
        return (result.innerHTML = `
          <p>${amount} ${baseCurrency.value}</p>
            <span>=</span>
          <p>${amount} ${baseCurrency.value}</p>
        `);
      }

      // displaying the result
      result.innerHTML = `
        <p>${amount} ${baseCurrency.value}</p>
          <span>=</span>
        <p>${exchangeRate} ${targetCurrency.value}</p>
      `;
    })
    .catch(err => {
      result.innerHTML = `<div class="error"></div>`; // this would display if an error occurred before the rate was fetched
      
      // console.log(err);
    });
}
getExchangeRate();
