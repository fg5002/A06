<script>
  import ListSelect from "./ListSelect.svelte";

  export let showTaxonList = false;
  export let source = [];
  export let result = [];

</script>

<ListSelect
  bind:showSelectList ={showTaxonList}
  source = {source}
  minChars = {3}
  filterList = {(f,s)=> f.hun.toLowerCase().includes(s) === true || f.ltn.toLowerCase().includes(s) === true || f.abr.indexOf(s)>-1}
  sortListField = "hun"
  multi = {false}
  result = {result}
  on:submitList
>
  <div slot="item" let:item>
    <span class="font-bold">{item.hun}</span>
    <span class="italic">{item.ltn}</span>
    <span class="text-sm self-center">{item.abr && `[${item.abr}]`}</span>
  </div>
</ListSelect>