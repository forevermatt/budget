<script>
import Icon from './Icon.svelte'
import { appError, clearError } from '../data/errors'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
</script>

<style>
/* Sits directly under the screen's header, inside the app rather than above
   it, so an error does not shove the chrome down the page. Full-bleed like the
   header it follows. */
.error-banner {
  align-items: flex-start;
  background: var(--error-container);
  color: var(--on-error-container);
  display: flex;
  gap: 10px;
  margin: 0 calc(var(--bs-gutter-x) * -0.5);
  padding: 14px 8px 14px 18px;
}

.error-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding-top: 2px;
}

.error-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
}

/* pre-line, since a store or sync failure can arrive with line breaks in it. */
.error-detail {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: pre-line;
}

/* Icon.svelte draws at 1em, so the glyph is sized by its own font-size. The
   44px box is the touch target. */
.error-dismiss {
  align-items: center;
  background: none;
  border: 0;
  color: inherit;
  display: flex;
  flex: 0 0 auto;
  font-size: 20px;
  height: 44px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 44px;
}
</style>

{#if $appError}
  <div class="error-banner" role="alert">
    <div class="error-text">
      <span class="error-title">{ $appError.title }</span>
      {#if $appError.detail}
        <span class="error-detail">{ $appError.detail }</span>
      {/if}
    </div>
    <button class="error-dismiss" type="button" aria-label="Dismiss" on:click={clearError}>
      <Icon icon={faTimes} />
    </button>
  </div>
{/if}
