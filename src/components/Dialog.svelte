<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let fullMessage = "";
    let currentCharacter = 0;

    $: currentlyDisplayedMessage = fullMessage.substring(0, currentCharacter);

    export function showMessage(text) {
        fullMessage = text;
        currentCharacter = 0;
    }

    onMount(() => {
        const intervalId = setInterval(() => {
            if (currentCharacter < fullMessage.length) {
                currentCharacter++;

                if (fullMessage.charAt(currentCharacter) === " ") {
                    currentCharacter++;
                }

                if (currentCharacter >= fullMessage.length) {
                    dispatch("animateMessageFinish");
                }
            }
        }, 100);

        return () => clearInterval(intervalId);
    });
</script>


<div class="bg-white rounded-sm p-3">
    {currentlyDisplayedMessage}
</div>

<style>
    div {
        font-family: "Kalam", cursive;
        font-size: 1.5rem;

        box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.3)
    }
</style>
