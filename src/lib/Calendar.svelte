<script>
  import Modal from "./Modal.svelte";
  import SveltyPicker from 'svelty-picker';

  export let showCalendar = false;
  export let calDate = new Date().toISOString().split('T')[0];

  const toggleCalendar = ()=> showCalendar=!showCalendar;

</script>

<Modal 
  bind:showModal={showCalendar}
  modalClass = "calendar"
  backdropClasses = "items-start justify-center z-2000"
>
  <SveltyPicker
    inputClasses="p-2 w-auto border-2 border-gray-700 rounded-md text-xl"
    format = "yyyy-mm-dd"
    clearBtn = false
    pickerOnly = true
    on:input = {toggleCalendar}
    bind:value = {calDate}
  />
</Modal>