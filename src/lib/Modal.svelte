<script>
  import { fly, fade } from 'svelte/transition';
  
  export let showModal=false;
  export let backdrop='z-2000';
  export let main='';

  const closeModal=()=> showModal=false;

</script>

{#if showModal}
  <div
    id="modal"
    class="fixed w-full h-full flex items-end justify-center bg-gray-500 bg-opacity-70 {backdrop}"
    in:fly={{ y: 500, duration: 300 }}
    out:fade={{ duration: 400 }}   
    on:pointerdown|stopPropagation={closeModal}
  >
    <div on:pointerdown|stopPropagation class="shadow-xl {main}">
      <slot/>
    </div>
  </div>
{/if}