<script>
export let params // URL parameters provider by router.

$: uuid = params.uuid
</script>

<h1>Amount for category {uuid}</h1>
