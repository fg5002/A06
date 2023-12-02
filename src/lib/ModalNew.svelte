<script>
  import { fade } from 'svelte/transition';
  
  export let showModal = false;

  function closeOnOutclick(event) {
    if (event.target.classList.contains('modal-background')) {
      showModal = false;
    }
  }

</script>

{#if showModal}
  <div class="fixed inset-0 z-2000 bg-black bg-opacity-30 flex items-center justify-center modal-background" on:pointerdown={closeOnOutclick} transition:fade={{duration: 300}}>
    <div class="flex flex-col items-center justify-center bg-white p-5 rounded shadow-lg text-center" transition:fade={{duration: 300}}>
      <slot></slot>
    </div>
  </div>
{/if}
