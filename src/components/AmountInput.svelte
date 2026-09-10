<script>
import { getNumericCharFrom, isBackspace, isPrintable } from '../helpers/characters'
import { createEventDispatcher, onMount } from 'svelte';

export let amount = 0
export let resultingAmount = 0

const dispatch = createEventDispatcher();

let inputField
let numeralsEntered = []

$: recordAndShowAmount(amount)

onMount(() => {
  recordAndShowAmount(amount)
  inputField.focus();
})

const recordAndShowAmount = amount => {
  numeralsEntered = getNumeralsFromAmount(amount)
  showNumerals(numeralsEntered)
  recordAmount(Number(numeralsEntered.join('')))
}

function getNumeralsFromAmount(value) {
  if ( ! value) {
    return [];
  }
  
  return String(value).split('').filter(function(char) {
    return ('0123456789'.indexOf(char) >= 0);
  })
}

function showNumerals(numerals) {
  var text = '';

  for (var i = 0; i < numerals.length; i++) {
    if (i === (numerals.length - 2)) {
      text += '.';
    }
    text += numerals[i];
  }

  if (text.length === 0) {
    text = '0.00';
  } else if (text.length === 1) {
    text = '0.0' + text;
  } else if (text.length === 2) {
    text = '0.' + text;
  } else if (text.length === 3) {
    text = '0' + text;
  }

  if (inputField) {
    inputField.value = text;
  }
}

function recordAmount(amount) {
  resultingAmount = amount
}

function onKeyDown(keyEvent) {
  var code = keyEvent.which;
  if (isPrintable(code)) {
    keyEvent.preventDefault();
  }

  var numericCharEntered = getNumericCharFrom(code);
  if (numericCharEntered) {
    numeralsEntered.push(numericCharEntered);
  } else if (isBackspace(code)) {
    keyEvent.preventDefault();
    numeralsEntered.pop();
  }

  showNumerals(numeralsEntered);
  recordAmount(Number(numeralsEntered.join('')));
}

function onSubmit(formEvent) {
  dispatch('next', resultingAmount);
}
</script>

<style>
.amount-box {
  align-items: center;
  border: 2px solid var(--primary);
  border-radius: 16px;
  display: flex;
  gap: 8px;
  height: 76px;
  padding: 0 18px;
}

.currency {
  color: var(--outline);
  font-size: 30px;
  font-weight: 600;
}

/* The box carries the border, so the field inside it is bare. */
.amount-value {
  background: none;
  border: 0;
  color: var(--on-surface);
  flex: 1;
  font-family: inherit;
  font-size: 38px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: -0.02em;
  min-width: 0;
  padding: 0;
  text-align: right;
}

.amount-value:focus {
  outline: none;
}
</style>

<form novalidate on:submit|preventDefault={onSubmit}>
  <div class="amount-box">
    <span class="currency" id="amount-input-currency-symbol">$</span>
    <input type="tel"
           aria-describedby="amount-input-currency-symbol"
           aria-label="Amount"
           bind:this={inputField}
           class="amount-value"
           on:keydown={onKeyDown} />
  </div>
</form>
