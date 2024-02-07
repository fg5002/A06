<script>
  import Modal from "./Modal.svelte";
  import SveltyPicker from 'svelty-picker';

  export let showTimePicker = false;
  export let time = new Date().toISOString().split('T')[1].substring(1, 5);

  const toggleTimePicker = ()=> showTimePicker=!showTimePicker;

  const showTime = ()=>{
    toggleTimePicker();
  }

  // TODO GMT+1 ???

</script>

<Modal bind:showModal={showTimePicker} modalClass = "timepicker" backdropClasses = "items-center z-2000">
    inputClasses="p-2 w-auto border-2 border-gray-700 rounded-md"
    mode = time
    format = "hh:ii"
    clearBtn = false
    pickerOnly = true
    manualInput = true
    on:input = {showTime}
    bind:value = {time}
  />
</Modal>