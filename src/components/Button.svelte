<script>
import Icon from 'fa-svelte'

export let icon
export let name
export let left = false
export let url = ''
</script>

<style>
a {
  color: #337ab7;
  font-weight: bold;
}

a:focus,
a:hover {
  color: #111;
}

a:focus .button-circle,
a:hover .button-circle {
  background-color: #111;
}

.button-circle {
  border-radius: 3rem;
  background-color: #337ab7;
  color: #fff;
  display: inline-block;
  font-size: 2rem;
  height: 4rem;
  line-height: 1rem;
  padding: 1rem;
  overflow: hidden;
  text-align: center;
  width: 4rem;
}
</style>

<a id="button-{ name }" class="btn" class:float-left={left}
   href="{ url || 'javascript:void(0)' }" role="button" on:click>
  <span class="button-circle">
    {#if icon }
      <Icon {icon} />
    {/if}<br />
  </span><br />
  { name }
</a>
