<script>

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();


  const clickHandler =()=> {
    dispatch('click');
  }

</script>

<div class="h-auto w-screen flex items-center p-2 bg-yellow-500">
  <button on:click|stopPropagation={clickHandler} class="w-12 h-12 font-bold border-2 border-green-700 rounded-md bg-lime-200 text-lg p-2 flex items-center justify-center">
    C
  </button>
  <audio controls loop class="ml-12 my-2">
    <source src="sounds/Coturnix coturnix.mp3" type="audio/mpeg">
    Your browser does not support the audio element.y
  </audio>
</div>