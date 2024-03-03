<script>
  export let name;
  export let data = null;
  export let needed = false;
  export let editor;

</script>

<div class="flex flex-wrap gap-0 items-center justify-start basis-full text-lg px-2" on:pointerup={editor}>
  {#if data === null || data.length === 0}
    <div class="font-bold select-none {needed ? 'text-red-600' : 'text-green-600'}">{name}</div>
  {:else}
    <slot/>
  {/if}
</div>