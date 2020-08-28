<script>
export let autofocusElement = {}

$: autofocusElement.focus && autofocusElement.focus()
</script>

<form on:submit|preventDefault>
  <slot />
</form>
