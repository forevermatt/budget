<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import Form from '../components/Form.svelte'
import { faHome } from '@fortawesome/free-solid-svg-icons'

let server = ''
let username = ''
let password = ''

const onSyncFormSubmit = async () => {
  console.log(server, username, password) // TEMP
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
