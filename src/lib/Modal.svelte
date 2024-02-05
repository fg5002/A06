<script>
  import { fade } from 'svelte/transition';
  
  export let showModal = false;
  export let zindex = 1000;
  export let position = "center";
  export let bg_class = "modal-background";

  function closeOnOutclick(event) {
    if (event.target.classList.contains(bg_class)) {
      showModal = false;
    }
  }

</script>


{#if showModal}
  <div 
    class="fixed inset-0 p-2 bg-neutral-300 bg-opacity-75 flex justify-center items-{position} {bg_class} z-{zindex}"
    on:pointerdown={closeOnOutclick} 
    transition:fade={{duration:300}}
  >
    <div class="flex shadow-lg bg-transparent rounded-md max-h-[100vh] xl:max-w-[75vh] xl:mt-24" 
      transition:fade={{duration:300}}
    >
      <slot></slot>
    </div>
  </div>
{/if}