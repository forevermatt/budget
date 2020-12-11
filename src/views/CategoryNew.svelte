<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { createCategory } from '../data/categories'
import { faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let name = ''
let element = {}

onMount(() => {
  element.focus()
})

function onSubmit() {
  const newCategory = createCategory(name)
  push(`/category/${newCategory.uuid}/amount`)
}
</script>

<form on:submit|preventDefault={onSubmit}>
  <h2><label for="new-category-name">New Category</label></h2>

  <input class="form-control" bind:value={name} placeholder="New category name"
         bind:this={element} id="new-category-name" />
</form>

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onSubmit} />
  <Button icon={faTimes} name="cancel" url="#/budget" left />
</ButtonRow>