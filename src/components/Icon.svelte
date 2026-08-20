<script>
export let icon // An icon from @fortawesome/free-solid-svg-icons.

// Icon data is [width, height, ligatures, unicode, svgPathData].
$: [width, height, , , path] = icon.icon
</script>

<style>
svg {
  display: inline-block;
  height: 1em;
  overflow: visible;
  width: 1em;
}
</style>

<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 { width } { height }">
  <path fill="currentColor" d="{ path }" />
</svg>
