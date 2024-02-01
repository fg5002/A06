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
  <div class="fixed inset-0 bg-gray-500 bg-opacity-60 flex justify-center items-{position} {bg_class} z-{zindex}" on:pointerdown={closeOnOutclick} transition:fade={{duration: 200}}>
    <div class="shadow-lg max-h-[50%] bg-yellow-200" transition:fade={{duration: 200}}>
      <slot></slot>
    </div>
  </div>
{/if}