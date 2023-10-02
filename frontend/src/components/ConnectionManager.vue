<!-- ConnectionManager.vue -->

<template>
	<div>
		<h1>Connection Manager Component</h1>
		<button @click="connect()">Connect</button>
		<button @click="disconnect()">Disconnect</button>
		<button @click="newMessage()">Send Message</button>
	</div>
</template>

<script>
import { socket } from "@/socket";

export default {
	name: "ConnectionManager",

	methods: {
		connect() {
			socket.connect();
		},
		disconnect() {
			socket.disconnect();
		},
		newMessage() {
			socket.newMessage();
		}
	}
}
</script>
