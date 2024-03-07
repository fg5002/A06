<script>
  import { createEventDispatcher } from 'svelte';
  import ListSelect, {inputField} from "./ListSelect.svelte";
  import TimePicker from "./TimePicker.svelte";
	import { currData } from './store';
  import TextInput from './TextInput.svelte';

  export let showAttributeList = false;
  export let source = [];
  export let result = $currData.attributes;
  
  let showTextModal = false;
  let showTimePicker = false;
  let inputAttribute = null;
  let edit = false;
  let selectedItem = null;
  let selectedValue = null;
  let selectedPlaceholder = "";
  let selectedType = "text";

  const dispatch = createEventDispatcher();
  
  const select = (i)=> {
    switch (i.type) {
      case 'bool':
        i.dis = i.nam;
        addItemToResult(i);        
        break;
      case 'text':
      case 'tel':
        selectedItem = i;
        selectedPlaceholder = selectedItem.nam;
        selectedType = i.type;
        showTextModal = true;       
        break;
      case 'time':
        selectedItem = i;
        selectedPlaceholder = selectedItem.nam;
        showTimePicker = true;
        break;
    }
  }

  const submitTextModal = (e)=> {
    selectedItem.value = e.detail;
    selectedItem.dis = selectedItem.rep.replace("*", selectedItem.value);
    addItemToResult(selectedItem);
    inputField.value = "";
  }  

  const submitTimePicker = (e)=> {
    selectedItem.value = e.detail;
    selectedItem.dis = selectedItem.rep.replace("*", selectedItem.value);
    addItemToResult(selectedItem);    
  }

  const addItemToResult = (i)=> {
    result = result.filter(f=> f.id != i.id);
    result.push(i);
    result = result.sort((a, b)=> parseInt(a["ord"]) - parseInt(b["ord"]));
    inputField.value = "";
    inputField.focus();
  }

  const removeItemFromResult = (i)=>{
    result = result.filter(f=> f.id !== i.id);
    inputField.value = "";
    inputField.focus();
  }

  const selectEditor = (i)=> {
    selectedItem = i;
    selectedValue = i.value
    selectedPlaceholder = i.nam;
    if(i.type === "time"){
      showTimePicker = true;
    }else{
      showTextModal = true;
    }
  }

</script>

<TextInput
  bind:showTextModal = {showTextModal}
  on:submitTextModal = {submitTextModal}
  bind:inputData = {selectedValue}
  bind:placeHolder = {selectedPlaceholder}
  bind:type = {selectedType}
/>

<TimePicker
  bind:showTimePicker = {showTimePicker}
  bind:time = {selectedValue}
  on:submitTimePicker = {submitTimePicker}
/>

<ListSelect
  bind:showSelectList ={showAttributeList}
  source = {source}
  minChars = {1}
  placeHolder = "Attributes"
  filterList = {(f,s)=> f.nam.includes(s) === true || f.abr === s}
  result = {result}
  searchText = {inputField && inputField.value}
  on:selectFirstItem = {(e)=> select(e.detail)}
  on:submit
  on:outroEnd
>

  <div
    slot="item"
    let:item
    class="p-1 pl-2  flex justify-between  border-b border-slate-400"
    on:pointerup|preventDefault={select(item)}
  >
    <span class="font-bold">{item.nam}</span>
  </div>

  <div
    slot="result"
    let:item
    class="flex justify-between border-b border-slate-400 divide-x divide-slate-400"
  >
    <span
      class="w-1/2 font-bold px-2 py-1"
      on:pointerdown|preventDefault={removeItemFromResult(item)}
    >{item.nam}</span>
    {#if item.type != 'bool'}
      <span
        class="font-bold w-1/2 bg-yellow-200 px-2 py-1"
        on:pointerdown|preventDefault={selectEditor(item)}
      >{item.value}</span>
    {/if}
  </div>
</ListSelect>