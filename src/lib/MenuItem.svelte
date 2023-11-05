<script>

  import { createEventDispatcher } from 'svelte';

  export let title;
  export let img = undefined;


  const dispatch = createEventDispatcher();


  const clickHandler =()=> {
    dispatch('click');
  }

</script>

<div
  on:pointerup|preventDefault={clickHandler}
  class="flex items-center justify-left gap-1 h-8 w-auto border-1 border-gray-700 rounded-sm bg-lime-300 p-1 text-lg"
>
  {#if img}
    <img src={img} alt="No" class="w-6 h-6">
  {/if}
  <span>{title}</span>
</div>