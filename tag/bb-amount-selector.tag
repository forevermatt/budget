<bb-amount-selector>
  <form class="pad-vertical text-center" novalidate onsubmit="{ formSubmitted }">
    <div class="input-group input-group-lg">
      <span class="input-group-addon">$</span>
      <input aria-label="Amount"
             class="amount form-control"
             onkeydown="{ keyDown }"
             ref="amount"
             type="tel" />
    </div>
  </form>

  <script>
  this.on('mount', function() {
    this.numeralsEntered = this.getNumeralsFromAmount(opts.amount);
    this.showNumerals(this.numeralsEntered);
    this.recordAmount(Number(this.numeralsEntered.join('')));
    this.refs.amount.focus();
  });

  this.numeralsEntered = [];
  this.resultingAmount = null;

  formSubmitted(formEvent) {
    formEvent.preventUpdate = true;
    this.trigger('next', this.resultingAmount);
  }

  getNumeralsFromAmount(value) {
    if ( ! value) {
      return [];
    }

    return String(value).split('').filter(function(char) {
      return ('0123456789'.indexOf(char) >= 0);
    })
  }

  getNumericCharFrom(code) {
    if (code >= 48 && code < 58) {
      return String(code - 48);
    } else if (code >= 96 && code < 106) {
      return String(code - 96);
    }
    return '';
  }

  isBackspace(code) {
    return (code === 8);
  }

  isPrintable(code) {
    return (code >= 32 && code < 112) ||
           (code >= 123 && code < 127) ||
           (code >= 186);
  }

  keyDown(keyEvent) {
    var code = keyEvent.which;
    if (this.isPrintable(code)) {
      keyEvent.preventDefault();
    }

    var numericCharEntered = this.getNumericCharFrom(code);
    if (numericCharEntered) {
      this.numeralsEntered.push(numericCharEntered);
    } else if (this.isBackspace(code)) {
      keyEvent.preventDefault();
      this.numeralsEntered.pop();
    }

    this.showNumerals(this.numeralsEntered);
    this.recordAmount(Number(this.numeralsEntered.join('')));
  }

  recordAmount(amount) {
    this.resultingAmount = amount;
  };

  showNumerals(numerals) {
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

    this.refs.amount.value = text;
  }
  </script>
</bb-amount-selector>
