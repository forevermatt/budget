<script>
import Icon from './Icon.svelte'

export let icon // See README for URL to gallery of available icons.
export let name = ''
export let url = ''
</script>

<style>
a {
  align-items: center;
  background-color: #00668a;
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(0, 77, 105, 0.3);
  color: #fff;
  display: flex;
  flex: 0 0 56px;
  font-size: 26px;
  height: 56px;
  justify-content: center;
  margin-left: 4px;
}

a:focus,
a:hover {
  background-color: #004d69;
  color: #fff;
}
</style>

<a id="button-{ name }" href="{ url || 'javascript:void(0)' }" role="button"
   aria-label={name} on:click>
  {#if icon }
    <Icon {icon} />
  {/if}
</a>
