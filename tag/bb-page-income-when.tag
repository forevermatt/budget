<bb-page-income-when>
  <bb-date-selector ref="selector"
                    transaction="{ opts.transaction }"></bb-date-selector>
  <bb-button-row buttons="{ this.buttons }"></bb-button-row>

  <script>
  this.buttons = [
    new bb.Button('home', 'home', '#budget', true)
  ];

  this.one('mount', function() {
    this.refs.selector.on('select', function(whenTimestamp) {
      opts.transaction.whenTimestamp = whenTimestamp;
      route('income/summary');
    })
  })
  </script>
</bb-page-income-when>
