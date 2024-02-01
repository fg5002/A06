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
    class="fixed inset-0 bg-gray-500 bg-opacity-70 flex justify-center place-items-{position} {bg_class} z-{zindex}"
    on:pointerdown={closeOnOutclick} 
    transition:fade={{duration:300}}
  >
    <div class="shadow-lg max-h-[50%] bg-transparent my-4" 
      transition:fade={{duration:300}}
    >
      <slot></slot>
    </div>
  </div>
{/if}