<script>
  import ListSelect, {inputField } from "./ListSelect.svelte";
  import { currData } from './store';

  export let showTaxonList = false;
  export let source = [];

  const select = (id)=> {
    inputField.value = "";
    $currData.taxon = source[id-1];
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
  multi = {false}
  searchText = {inputField && inputField.value}
  on:selectFirstItem = {(e)=> select(e.detail)}
>
  <div slot="item" class="px-2 pt-1" let:item on:pointerup|preventDefault={select(item.id)}>
    <span class="font-bold">{item.hun}</span>
    <span class="italic">{item.ltn}</span>
    <span class="text-red-500 self-center">{item.abr && `[${item.abr}]`}</span>
  </div>
</ListSelect>