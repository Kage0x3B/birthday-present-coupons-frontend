<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { fade, fly, slide, blur, scale } from "svelte/transition";

    const dispatch = createEventDispatcher();

    let fullMessage = "";
    let currentCharacter = 0;
    let answers = [];
    let isQuestion = false;
    let showAnswers = false;

    $: currentlyDisplayedMessage = fullMessage.substring(0, currentCharacter);

    export function showMessage(msg) {
        if (Array.isArray(msg)) {
            fullMessage = msg[Math.floor(Math.random() * msg.length)];
        } else {
            fullMessage = msg;
        }

        currentCharacter = 0;

        isQuestion = false;
        showAnswers = false;
    }

    export function showQuestion(question, _answers) {
        if (Array.isArray(question)) {
            fullMessage = question[Math.floor(Math.random() * question.length)];
        } else {
            fullMessage = question;
        }

        currentCharacter = 0;

        isQuestion = true;
        showAnswers = false;

        answers = _answers;
    }

    function chooseAnswer(answer) {
        setTimeout(() => dispatch("chooseAnswer", answer), 300);
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

                    if (isQuestion) {
                        showAnswers = true;
                    }
                }
            }
        }, 50);

        return () => clearInterval(intervalId);
    });
</script>

<div>
    <div class="message bg-white rounded-sm p-3">
        {currentlyDisplayedMessage}
    </div>

    {#if showAnswers}
        {#each answers as answer, i}
            <div class="answer rounded-sm px-3 py-2 mt-3" on:click={() => chooseAnswer(answer)}
                 in:scale={{duration: 800}}>
                {answer.msg}
            </div>
        {/each}
    {:else}

        {#each answers as answer, i}
            <div class="answer-placeholder px-3 py-2 mt-3">
                {answer.msg}
            </div>
        {/each}
    {/if}
</div>

<style>
    div {
        font-family: "Kalam", cursive;
        font-size: 1.5rem;
    }

    .message {
        box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.3);
    }

    .answer-placeholder {
        opacity: 0;
    }

    .answer {
        transition: all 0.3s;
        background-color: var(--yellow);
        color: var(--brown);
        box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.3);
    }

    .answer:hover, .answer:focus {
        box-shadow: 6px 4px 0 rgba(0, 0, 0, 0.6);
        transform: scale(95%);
    }
</style>
