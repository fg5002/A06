<script>

  import { createEventDispatcher } from 'svelte';

  export let title = undefined;
  export let img = undefined;


  const dispatch = createEventDispatcher();


  const clickHandler =()=> {
    dispatch('click');
  }

</script>

<button
  on:click|stopPropagation
  class="flex items-center justify-left gap-2 w-auto h-auto border-2 border-gray-700 rounded-md shadow-xl bg-lime-300 p-2 text-base"
>
  {#if img}
    <img src={img} alt="No" class="w-auto h-6">
  {/if}
  {#if title}
    <span>{title}</span>
  {/if}
</button>