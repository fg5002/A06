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

<Modal bind:showModal={showTimePicker} zindex=2000 position=center bg_class=timepicker>
  <SveltyPicker
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