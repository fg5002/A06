<script>
  import ListSelect, {inputField} from "./ListSelect.svelte";
  import {currData} from "./store";

  export let showObserverList = false;
  export let source = [];
  export let result = [];

  const select = (id)=> {
    result = result.filter(f=> f.id !=source[id-1].id);
    result.push(source[id-1])
    result.sort((a, b)=> a.nam.localeCompare(b.nam, 'hu'));
    inputField.value = "";
    inputField.focus();
  }

  const remove = (id)=>{
    result = result.filter(f=> f.id !== id)
    inputField.value = "";
    inputField.focus();
  }

  const submit = ()=> $currData.observer = result;

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
  on:submit={submit}
>
  <div class="font-semibold px-2 pt-1" slot="item" let:item on:pointerup|preventDefault={select(item.id)}>
    <span>{item.nam}</span>
  </div>
  
  <div class="font-semibold px-2 pt-1 bg-lime-300" slot="result" let:item on:pointerup|preventDefault={remove(item.id)}>
    <span class="">{item.nam}</span>
  </div>
</ListSelect>