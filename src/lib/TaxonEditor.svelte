<script>
  import Calendar from "./Calendar.svelte";
  import Modal from "./Modal.svelte";
  
  export let showEditor = false;

  let currDate = ""
  let showCalendar = false;

  const toggleCalendar = ()=> showCalendar=!showCalendar;

</script>

<Modal bind:showModal={showEditor} zindex = 2000 position=start bg_class=taxon>
  <div class="w-[400px] h-[600px] flex flex-col gap-2 justify-end items-center">
    <Calendar bind:showCalendar bind:calDate={currDate}/>
    <button class=" border-slate-500 border-2 rounded-md w-24" on:click={toggleCalendar}>Calendar</button>
    <input type="text" class="bg-yellow-200 border-2 border-gray-700 rounded-md p-2 m-8" bind:value = {currDate}>
  </div>
</Modal>