<script>

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();


  const clickHandler =()=> {
    dispatch('click');
  }

</script>

<button
  on:click|stopPropagation={clickHandler}
  class="w-12 h-12 font-bold border-2 border-green-700 rounded-md bg-lime-200 text-lg p-2 flex items-center justify-center"
>
  <slot/>
</button>
