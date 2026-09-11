<script>
import Icon from './Icon.svelte'

export let icon // See README for URL to gallery of available icons.
export let name = ''
export let url = ''
</script>

<style>
a {
  align-items: center;
  background-color: var(--primary-container);
  border-radius: 18px;
  box-shadow: 0 8px 22px var(--action-shadow);
  color: var(--on-primary);
  display: flex;
  flex: 0 0 56px;
  font-size: 26px;
  height: 56px;
  justify-content: center;
  margin-left: 4px;
}

a:focus,
a:hover {
  background-color: var(--primary);
  color: var(--on-primary);
}
</style>

<a id="button-{ name }" href="{ url || 'javascript:void(0)' }" role="button"
   aria-label={name} on:click>
  {#if icon }
    <Icon {icon} />
  {/if}
</a>
