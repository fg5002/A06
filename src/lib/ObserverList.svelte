<script>
  import { createEventDispatcher } from 'svelte';
  import ListSelect, {inputField} from "./ListSelect.svelte";

  export let showObserverList = false;
  export let source = [];
  export let result = [];

  const dispatch = createEventDispatcher();

  const select = (id)=> {
    //console.log(source[id-1].nam);
    result.push(source[id-1])
    result.sort((a, b)=> parseInt(a["ord"]) - parseInt(b["ord"]));
    inputField.value = "";
    inputField.focus();
  }

  const remove = (id)=>{
    result = result.filter(f=> f.id !== id)
    inputField.value = "";
    inputField.focus();
    console.log(result)
  }

</script>

<ListSelect
  bind:showSelectList ={showObserverList}
  source = {source}
  placeHolder = "Observers"
  minChars = {1}
  multi = {true}
  result = {result}
  searchText = {inputField && inputField.value}
  on:selectFirstItem = {(e)=> select(e.detail)}
  on:submit
>
  <div class="p-2" slot="item" let:item on:pointerup|preventDefault={select(item.id)}>
    <span class="font-bold p-2">{item.nam}</span>
  </div>
  
  <div slot="result" class="p-2 bg-lime-300" let:item on:pointerup|preventDefault={remove(item.id)}>
    <span class="font-bold p-2">{item.nam}</span>
  </div>
</ListSelect>