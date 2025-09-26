<script>
import { errorMessage, clearError } from '../data/errors'
</script>

<style>
.keep-line-breaks {
  white-space: pre-line;
}
</style>

{#if $errorMessage}
  <div class="alert alert-danger keep-line-breaks" role="alert">
    <button type="button" class="close" on:click={clearError} aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    {$errorMessage}
  </div>
{/if}
