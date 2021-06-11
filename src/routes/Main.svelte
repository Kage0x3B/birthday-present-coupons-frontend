<script>
    import Avatar from "../components/Avatar.svelte";
    import Dialog from "../components/Dialog.svelte";
    import { onMount } from "svelte";

    let greetings = ["Hi, wie geht's dir so?", "Na, hattest du einen schönen Tag?", "Hallöchen, wie geht's?"];

    // greeting
    let state = "greeting";
    let panda;
    let dialog;

    function onMessageAnimateFinish() {
        if (state === "greeting") {
            panda.wiggle();

            setTimeout(() => {

            }, 1000);
        }
    }

    onMount(() => {
        dialog.showMessage(greetings[Math.floor(Math.random() * greetings.length)]);
    });
</script>

<div class="main-container d-flex justify-content-around align-items-center flex-column p-3">
    <div>
        <Avatar bind:this={panda} />
    </div>
    <div>
        <Dialog bind:this={dialog} on:animateMessageFinish={onMessageAnimateFinish} />
    </div>
</div>

<style>
    .main-container {
        height: 100vh;
    }
</style>
