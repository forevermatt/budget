<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import Form from '../components/Form.svelte'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import database from '../data/database'
import { push } from 'svelte-spa-router'

let server = localStorage.getItem('sync.server') || 'http://localhost:5984'
let username = localStorage.getItem('sync.username') || ''
let password = localStorage.getItem('sync.password') || ''

const onSyncFormSubmit = async () => {
  // Persist settings
  localStorage.setItem('sync.server', server)
  localStorage.setItem('sync.username', username)
  localStorage.setItem('sync.password', password)

  // Start or restart sync
  const succeeded = await database.configureSync(server, username, password)
  if (succeeded) {
    push(`/budget`)
  }
}
</script>

<h2>Settings</h2>

<h3>Sync</h3>
<Form on:submit={onSyncFormSubmit}>
  <label>
    Server:
    <input class="form-control" name="server" placeholder="Server" bind:value={server} />
  </label>
  <label>
    Username:
    <input class="form-control" name="username" placeholder="Username" bind:value={username} />
  </label>
  <label>
    Password:
    <input class="form-control" name="password" placeholder="Password" type="password" bind:value={password} />
  </label>
  <button type="submit">Save</button>
</Form>

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
