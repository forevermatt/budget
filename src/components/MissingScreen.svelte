<script>
import Icon from './Icon.svelte'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

export let heading = ''
export let body = ''
export let actionLabel = ''
export let actionUrl = ''
export let detail = '' // Whatever the failure itself said, kept but demoted.
</script>

<style>
.missing {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 40px 16px 0;
}

/* Icon.svelte draws at 1em, so the glyph is sized by its own font-size. */
.missing-icon {
  align-items: center;
  background: var(--error-container);
  border-radius: 16px;
  color: var(--on-error-container);
  display: flex;
  font-size: 28px;
  height: 52px;
  justify-content: center;
  line-height: 1;
  width: 52px;
}

.missing-heading {
  color: var(--on-surface);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 30px;
  margin: 0;
}

.missing-body {
  color: var(--on-surface-variant);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  margin: 0;
}

/* The app's first standard filled button: the docked action is a circle, and
   a dead end needs a labelled way out. */
.missing-action {
  align-items: center;
  background: var(--primary);
  border-radius: 14px;
  color: var(--on-primary);
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 52px;
  margin-top: 6px;
  padding: 0 24px;
  text-decoration: none;
}

/* Available for a bug report, but never the first thing read. */
.missing-detail {
  align-self: stretch;
  background: var(--inverse-on-surface);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 14px;
  padding: 12px 14px;
}

.missing-detail-label {
  color: var(--on-surface-variant);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.missing-detail-text {
  color: var(--on-surface-variant);
  font-family: ui-monospace, monospace;
  font-size: 13px;
  font-weight: 500;
}
</style>

<div class="missing">
  <span class="missing-icon"><Icon icon={faExclamationCircle} /></span>
  <h3 class="missing-heading">{ heading }</h3>
  <p class="missing-body">{ body }</p>
  <a class="missing-action" href={actionUrl}>{ actionLabel }</a>
  {#if detail}
    <div class="missing-detail">
      <span class="missing-detail-label">Technical detail</span>
      <span class="missing-detail-text">{ detail }</span>
    </div>
  {/if}
</div>
