<script>
  import { createEventDispatcher } from 'svelte';
  import ListSelect, {inputField } from "./ListSelect.svelte";
  import { currData } from './store';

  export let showTaxonList = false;
  export let source = [];
  export let result = null;

  const dispatch = createEventDispatcher();

  const select = (e)=> {
    inputField.value = "";
    result = e.detail;
    showTaxonList = false;
  }

</script>

<ListSelect
  bind:showSelectList ={showTaxonList}
  source = {source}
  minChars = {3}
  placeHolder = "Taxon"
  filterList = {(f,s)=> f.hun.toLowerCase().includes(s) === true || f.ltn.toLowerCase().includes(s) === true || f.abr.indexOf(s)>-1 && f.mon != null}
  sortListField = "hun"
  searchText = {inputField && inputField.value}
  on:selectFirstItem = {select}
  on:outroEnd
>
  <div slot="item" class="px-2 pt-1 border-b border-slate-400" let:item on:pointerup|preventDefault={select(item)}>
    <span class="font-semibold">{item.hun}</span>
    <span class="italic">{item.ltn}</span>
    <span class="text-red-500 self-center">{item.abr && `[${item.abr}]`}</span>
  </div>
</ListSelect>