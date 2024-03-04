<script>
  export let name;
  export let data = null;
  export let needed = false;
  export let editor;
  export let classes = ""

</script>

<div class="flex flex-wrap items-center basis-full text-lg px-2 py-1 {data === null || data.length === 0 ? 'justify-end' : 'justify-start'} {classes}" on:pointerup={editor}>
  {#if data === null || data.length === 0}
    <span class="font-bold w-1/4 select-none {needed ? 'text-red-600' : 'text-green-600'}">{name}</span>
  {:else}
    <slot/>
  {/if}
</div>