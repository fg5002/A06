<script>
  import { fade } from 'svelte/transition';
  
  export let showModal = false;
  export let zindex = 1000;
  export let position = "start";
  export let bg_class = "modal-background";

  function closeOnOutclick(event) {
    if (event.target.classList.contains(bg_class)) {
      showModal = false;
    }
  }

</script>

{#if showModal}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-end justify-center {bg_class} z-{zindex} items-{position}" on:pointerdown={closeOnOutclick} transition:fade={{duration: 200}}>
    <div class="flex flex-col items-center justify-center bg-white mb-8 rounded shadow-lg text-center" transition:fade={{duration: 200}}>
      <slot></slot>
    </div>
  </div>
{/if}
