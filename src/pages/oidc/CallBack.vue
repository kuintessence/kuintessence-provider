<template>
	<q-page>
		<div class="fixed-center text-center">
			<p>
				<q-spinner-ios color="primary" size="100px" class="q-ma-md" />
			</p>
			<p class="text-body2 text-weight-medium">正在登录，请稍候...</p>
			<p></p>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { $mgr } from 'src/boot/oidc';
import { onMounted } from 'vue';

onMounted(() => {
	try {
		$mgr.callBack();
	} catch (e) {
		console.error(e);
	}
});
</script>
