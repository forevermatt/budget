<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import MissingScreen from '../components/MissingScreen.svelte'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'

// The path asked for is this screen's equivalent of an error's raw text.
const requested = window.location.hash || '(none)'
</script>

<DetailHeader title="Not found" backUrl="#/budget" />

<MissingScreen heading="This page isn't here"
               body="The link that brought you here may be out of date, or the address may have a typo in it."
               actionLabel="Back to budget" actionUrl="#/budget"
               detail={requested} />

<ButtonRow>
  <Button icon={faDollarSign} name="expense" url="#/expense/new" />
</ButtonRow>
