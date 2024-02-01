<script>
  import Calendar from "./Calendar.svelte";
  import Modal from "./Modal.svelte";
  import BigModal from "./BigModal.svelte";
  
  export let showEditor = false;

  let currDate = "Date"
  let showCalendar = false;

  const toggleCalendar = ()=> showCalendar=!showCalendar;

  //const focus = (node)=> node.focus();

</script>

<BigModal bind:showBigModal={showEditor} bgClass=taxon position=start>
  <Calendar
    bind:showCalendar
    bind:calDate={currDate}
  />
  <div class="flex flex-col gap-2 h-[60vh] bg-transparent rounded-md">
    <div class="flex gap-2 bg-transparent">
      <div class="text-center text-2xl font-bold text-justify-center py-1">
        {currDate}
      </div>
      <button 
        class="border-slate-500 border-2 rounded-md px-2 py-1 text-center bg-yellow-400" 
        on:click={toggleCalendar}
        >
        <img src={'images/edit.svg'} alt="No" class="w-auto h-auto">
      </button>
    </div>
    <div class="flex flex-row content-start flex-wrap gap-2 bg-yellow-100 h-full p-4 text-lg text-left border-slate-500 border-2 rounded-md overflow-y-auto">
      <div class="mr-2 bg-transparent hover:bg-red-300"><b>Erdei pocok</b> (Microtus sylvestris)</div>
      <div class="mr-2 bg-transparent hover:bg-red-300">2ad</div>
      <div class="mr-2 bg-transparent hover:bg-red-300">3juv</div>
      <div class="mr-2 bg-transparent hover:bg-red-300">Hangosan cincogva kergették egymást a bokrok között.</div>
      <div class="mr-2 bg-transparent text-red-500 hover:bg-red-300 hover:text-black">Ócsag Attila</div>
    </div>

  </div>
</BigModal>