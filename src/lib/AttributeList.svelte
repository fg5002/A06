<script>
  import ListSelect from "./ListSelect.svelte";

  export let showAttributeList = false;
  export let source = [];
  export let result = [];

</script>

<ListSelect
  bind:showSelectList ={showAttributeList}
  source = {source}
  minChars = {1}
  filterList = {(f,s)=> f.nam.includes(s) === true || f.abr === s}
  multi = {true}
  sortResult = {(a, b)=> parseInt(a["ord"]) - parseInt(b["ord"])}
  result = {result}
  on:submitList
>
  <div slot="item" let:item>
    <span class="font-bold">{item.nam}</span>
  </div>
  <div slot="result" let:item>
    <span class="font-bold">{item.nam}</span>
  </div>
</ListSelect>