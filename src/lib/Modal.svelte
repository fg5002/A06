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
    class="fixed inset-0 bg-neutral-300 bg-opacity-75 flex justify-center items-{position} {bg_class} z-{zindex}"
    on:pointerdown={closeOnOutclick} 
    transition:fade={{duration:300}}
  >
    <div class="shadow-lg bg-transparent rounded-md max-h-[50vh]" 
      transition:fade={{duration:300}}
    >
      <slot></slot>
    </div>
  </div>
{/if}