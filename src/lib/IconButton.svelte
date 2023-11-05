<script>
  export let img = '';
  //export let className ="";

</script>

<button 
  class="w-12 h-12 font-bold border-2 border-green-700 rounded-md bg-lime-200 text-lg p-2 flex items-center justify-center" 
  on:click|stopPropagation
>
  <img src={img} alt="No"> 
</button>