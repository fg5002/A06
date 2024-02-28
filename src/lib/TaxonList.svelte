<script>
  import { createEventDispatcher } from 'svelte';
  import ListSelect, {inputField } from "./ListSelect.svelte";

  export let showTaxonList = false;
  export let source = [];

  const dispatch = createEventDispatcher();

  const select = (id)=> {
    console.log(source[id-1].hun);
    inputField.value = "";
    inputField.focus();
    dispatch('submit', source[id-1]);
  }

</script>

<ListSelect
  bind:showSelectList ={showTaxonList}
  source = {source}
  minChars = {3}
  placeHolder = "Taxon"
  filterList = {(f,s)=> f.hun.toLowerCase().includes(s) === true || f.ltn.toLowerCase().includes(s) === true || f.abr.indexOf(s)>-1 && f.mon != null}
  sortListField = "hun"
  multi = {false}
  searchText = {inputField && inputField.value}
  on:selectFirstItem = {(e)=> select(e.detail)}
>
  <div slot="item" class="p-1" let:item on:pointerup|preventDefault={select(item.id)}>
    <span class="font-bold">{item.hun}</span>
    <span class="italic">{item.ltn}</span>
    <span class="text-sm self-center">{item.abr && `[${item.abr}]`}</span>
  </div>
</ListSelect>