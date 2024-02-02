<script>
  import Calendar from "./Calendar.svelte";
  import Modal from "./Modal.svelte";
  import BigModal from "./BigModal.svelte";
  
  export let showEditor = false;

  let currDate = new Date().toISOString().split('T')[0]
  let showCalendar = false;

  const toggleCalendar = ()=> showCalendar=!showCalendar;

</script>

<BigModal bind:showBigModal={showEditor} bgClass=taxon position=start>
  <Calendar
    bind:showCalendar
    bind:calDate={currDate}
  />
  <div class="flex flex-col gap-2 h-[50vh] bg-transparent rounded-md">
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
    <div class="flex flex-wrap gap-2 content-start items-start bg-yellow-100 h-full p-4 text-lg text-left border-slate-500 border-2 rounded-md overflow-y-auto">
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Taxon')}><b>Cserregő nádiposzáta</b> (Acrocephalus scirpaceus)</span>
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Ad')}>2ad</span>
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Juv')}>3juv</span>
      <span class="mr-2 select-none bg-red-300" on:pointerup={()=>alert('Note')}>Run on the field.</span>
      <span class="mr-2 select-none bg-red-300 text-black" on:pointerup={()=>alert('observer')}>Wintermann Eleonóra Lujza, Kolozsvári Grandpierre Emil</span>
    </div>

  </div>
</BigModal>