<script>
  export let name;
  export let data = null;
  export let needed = false;
  export let editor;
  export let classes = ""

</script>

<div class="flex flex-wrap items-center justify-start basis-full text-lg px-2 {classes}" on:pointerup={editor}>
  {#if data === null || data.length === 0}
    <div class="font-bold py-1 select-none {needed ? 'text-red-600' : 'text-green-600'}">{name}</div>
  {:else}
    <slot/>
  {/if}
</div>