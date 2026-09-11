<script>
import ErrorMessage from './ErrorMessage.svelte'
import Icon from './Icon.svelte'
import { faChevronLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

export let title = ''
export let backUrl = ''
export let menuLabel = '' // Names the menu for a screen reader, e.g. "Account actions".

// The expense flow reuses this header for its steps, which carry no menu.

let menuOpen = false

const toggleMenu = () => menuOpen = !menuOpen
const closeMenu = () => menuOpen = false
const onKeydown = ({ key }) => {
  if (key === 'Escape') {
    closeMenu()
  }
}
</script>

<style>
/* As on the budget overview, the header runs edge to edge and so has to escape
   the padding and top margin of the app-wide container. It also anchors the
   menu, which hangs below it. */
.detail-header {
  align-items: center;
  background: var(--primary);
  color: var(--on-primary);
  display: flex;
  gap: 4px;
  margin: -1rem calc(var(--bs-gutter-x) * -0.5) 0;
  padding: 16px 12px 14px 8px;
  position: relative;
}

/* Icon.svelte draws at 1em, so each icon is sized by its own font-size. The
   44px box is the touch target, not the glyph. */
.back,
.menu-button {
  align-items: center;
  color: inherit;
  display: flex;
  flex: 0 0 auto;
  font-size: 24px;
  height: 44px;
  justify-content: center;
  line-height: 1;
  width: 44px;
}

.back {
  text-decoration: none;
}

.menu-button {
  background: none;
  border: 0;
  border-radius: 12px;
  padding: 0;
}

.menu-button.open {
  background: rgba(255, 255, 255, 0.16);
}

.detail-header h2 {
  flex: 1;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-menu {
  background: var(--surface-container-lowest);
  border-radius: 18px;
  box-shadow: 0 16px 40px var(--menu-shadow);
  overflow: hidden;
  padding: 6px 0;
  position: absolute;
  right: 14px;
  top: 68px;
  width: 244px;
  z-index: 3;
}
</style>

<svelte:window on:click={closeMenu} on:keydown={onKeydown} />

<header class="detail-header">
  <a class="back" href={backUrl} aria-label="Back">
    <Icon icon={faChevronLeft} />
  </a>
  <h2>{ title }</h2>
  <slot name="meta" />
  {#if $$slots.menu}
    <!-- Stops the opening click reaching the window handler that closes it.
         Clicks on the items themselves are left to bubble, so choosing one
         closes the menu. -->
    <button class="menu-button" class:open={menuOpen} type="button"
            aria-label={menuLabel} aria-haspopup="true" aria-expanded={menuOpen}
            on:click|stopPropagation={toggleMenu}>
      <Icon icon={faEllipsisH} />
    </button>
    {#if menuOpen}
      <div class="detail-menu" role="menu">
        <slot name="menu" />
      </div>
    {/if}
  {/if}
</header>

<ErrorMessage />
