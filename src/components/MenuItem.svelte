<script>
export let url = ''
export let danger = false
export let separated = false // Draws the rule that fences off a destructive action.
</script>

<style>
a {
  align-items: center;
  color: var(--on-surface);
  display: flex;
  font-size: 15px;
  font-weight: 600;
  height: 48px;
  padding: 0 18px;
  position: relative;
  text-decoration: none;
}

a.danger {
  color: var(--error);
}

/* A pseudo-element rather than a border, so the rule and the 6px of air on
   either side of it leave the 48px row itself untouched. */
a.separated {
  margin-top: 13px;
}

a.separated::before {
  background: var(--surface-container);
  content: '';
  height: 1px;
  left: 0;
  position: absolute;
  right: 0;
  top: -7px;
}
</style>

<a class:danger class:separated role="menuitem"
   href="{ url || 'javascript:void(0)' }" on:click>
  <slot />
</a>
