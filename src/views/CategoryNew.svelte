<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { addCategory } from '../data/categories'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let name = ''
let element = {}

onMount(() => {
  element.focus()
})

const onSubmit = async () => {
  const newCategoryId = await addCategory(name)
  push(`/category/${newCategoryId}/amount`)
}
</script>

<form on:submit|preventDefault={onSubmit}>
  <h2><label for="new-category-name">New Category</label></h2>

  <input class="form-control" bind:value={name} placeholder="New category name"
         bind:this={element} id="new-category-name" />
</form>

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onSubmit} />
</ButtonRow>