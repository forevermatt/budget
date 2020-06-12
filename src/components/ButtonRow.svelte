<style>
#button-row {
  bottom: 10px;
  left: 10px;
  position: fixed;
  right: 10px;
  text-align: right;
}
#button-row-spacer {
  height: 100px;
}
</style>

<div id="button-row-spacer"></div>
<div id="button-row">
  <slot />
  <div class="clearfix"></div>
</div>
