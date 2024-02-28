<script>
  import { fade , fly} from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  export let showModal = false;
  export let backdropClasses = "items-center z-2000";
  export let modalClass = "baseModal";
  export let mainClasses= "";

  const dispatch = createEventDispatcher();


  function closeOnOutclick(e) {
    if (e.target.classList.contains(modalClass)) {
      showModal = false;
    }
  }

</script>


{#if showModal}
  <div 
    class="fixed inset-0 flex bg-transparent bg-opacity-75 mt-12 {modalClass} {backdropClasses}"
    on:pointerdown={closeOnOutclick} 
    in:fly={{x: 500, duration: 500}}
    out:fly={{x: 500, duration: 800}}
  >
    <div 
      class="flex shadow-lg rounded-sm max-h-[100vh] bg-lime-200 {mainClasses}" 
    >
      <slot/>
    </div>
  </div>
{/if}