<script>
  import { fade , fly} from 'svelte/transition';
  
  export let showModal = false;
  export let backdropClasses = "items-center z-2000";
  export let modalClass = "baseModal";
  export let mainClasses= "";


  function closeOnOutclick(event) {
    if (event.target.classList.contains(modalClass)) {
      showModal = false;
    }
  }

</script>


{#if showModal}
  <div 
    class="fixed inset-0 p-2 bg-transparent bg-opacity-75 flex justify-center {modalClass} {backdropClasses}"
    on:pointerdown={closeOnOutclick} 
    in:fly={{y: -500, duration: 500}}
    out:fly={{y: -500, duration: 800}}
  >
    <div 
      class="flex shadow-lg rounded-md max-h-[100vh] bg-transparent {mainClasses}" 
    >
      <slot></slot>
    </div>
  </div>
{/if}