<script>
import { errorMessage, clearError } from '../data/errors'
</script>

<style>
.keep-line-breaks {
  white-space: pre-line;
}
</style>

{#if $errorMessage}
  <div class="alert alert-danger alert-dismissible keep-line-breaks" role="alert">
    <button type="button" class="btn-close" on:click={clearError} aria-label="Close"></button>
    {$errorMessage}
  </div>
{/if}
