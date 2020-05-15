<script>
import { getNumericCharFrom, isBackspace, isPrintable } from '../helpers/characters'
import { createEventDispatcher, onMount } from 'svelte';

export let amount

const dispatch = createEventDispatcher();

let inputField
let numeralsEntered = []
let resultingAmount = null

onMount(() => {
  numeralsEntered = getNumeralsFromAmount(amount)
  showNumerals(numeralsEntered)
  recordAmount(Number(numeralsEntered.join('')))
  inputField.focus();
})

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

  inputField.value = text;
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

<form novalidate on:submit|preventDefault={onSubmit}>
  <div class="input-group input-group-lg">
    <div class="input-group-prepend">
      <span class="input-group-text" id="amount-input-currency-symbol">$</span>
    </div>
    <input type="tel"
           aria-describedby="amount-input-currency-symbol"
           aria-label="Amount"
           bind:this={inputField}
           class="text-right form-control"
           on:keydown={onKeyDown} />
  </div>
</form>
