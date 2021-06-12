<template>
	<div class="guide">
		<img
			src="@/assets/img/guide.png"
		/>
		<p>横屏观看，体验更佳</p>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less">
.guide {
	position: absolute;
	top: 40%;
	left: 50%;
	margin: auto;
	text-align: center;
  transform: translate(-50%, -50%);
  img {
    width: 5rem;
    animation: oReverse 2.5s infinite 1s;
  }
  p {
    margin-top: 1rem;
    font-size: 1rem;
    color: #fff;
  }
}

@keyframes oReverse {
  from{transform: rotate(0deg);}
  to{transform: rotate(90deg);}
}
</style>