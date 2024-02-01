<script>
  import Calendar from "./Calendar.svelte";
  import Modal from "./Modal.svelte";
  
  export let showEditor = false;

  let currDate = ""
  let showCalendar = false;

  const toggleCalendar = ()=> showCalendar=!showCalendar;

  const focus = (node)=> node.focus();

</script>

<Modal bind:showModal={showEditor} zindex=2000 bg_class=taxon position=start>
  <div class="flex flex-col gap-2 px-24 bg-lime-200 w-screen h-full pt-12 border-zinc-500 border-2 rounded-md items-center">
    <Calendar
      bind:showCalendar
      bind:calDate={currDate}
    />
    <button 
      class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400 w-28" 
      on:click={toggleCalendar}
    >Calendar</button>
    <input 
      class="bg-yellow-100  focus:bg-yellow-200 border-2 border-gray-700 rounded-md p-2 text-left justify-self-start w-28" 
      type="text" 
      bind:value={currDate}
      use:focus
    >
  </div>
</Modal>