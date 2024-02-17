<script>
	import '../app.postcss';
  import Navbar from '$lib/Navbar.svelte';
</script>

<body class="overscroll-contain">
  <div class="flex flex-col h-screen w-screen">
    <Navbar/>
    <slot />
  </div>
</body>