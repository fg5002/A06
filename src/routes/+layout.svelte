<script>
	import '../app.postcss';
</script>

<div class="flex flex-col h-screen w-screen">

  <nav class="p-3 bg-lime-400 border-b-2 border-green-700">
    <a class="border border-gray-500 rounded-md py-1 px-2  mr-1 bg-yellow-400 font-semibold" href="/">Home</a>
    <a class="border border-gray-500 rounded-md py-1 px-2  mr-1 bg-yellow-400 font-semibold" href="/map">Map</a>
    <!--a class="border border-gray-500 rounded-md py-1 px-2  mr-1 bg-yellow-400 font-semibold" href="/datalist">Data list</a-->
  </nav>
  
  <slot />

</div>
