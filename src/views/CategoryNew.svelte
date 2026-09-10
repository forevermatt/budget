<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import TextField from '../components/TextField.svelte'
import { addCategory } from '../data/categories'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

let name = ''

const onSubmit = async () => {
  const newCategoryId = await addCategory(name)
  push(`/category/${newCategoryId}/amount`)
}
</script>

<DetailHeader title="New category" backUrl="#/budget" />

<TextField id="new-category-name" label="Category name" bind:value={name} on:submit={onSubmit} />

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onSubmit} />
</ButtonRow>
