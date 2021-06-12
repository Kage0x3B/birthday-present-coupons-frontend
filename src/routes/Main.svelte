<script>
    import Avatar from "../components/Avatar.svelte";
    import Dialog from "../components/Dialog.svelte";
    import { onMount } from "svelte";
    import api from "../api/api.mjs";

    let greetings = [
        "Hi, wie geht's dir so?",
        "Na, hattest du einen schönen Tag?",
        "Hallöchen, wie geht's?"
    ];
    let doSomethingQuestions = [
        "Willst du heute was kleines unternehmen?", "Wie wärs, willst du heute was kleines unternehmen?",
        "Hast du Lust etwas kleines zu unternehmen?"
    ];

    let unsureQuestions = [
        "Oh schade, sicher, dass du heute nichts unternehmen willst?",
        "Also wir können auch morgen was unternehmen, sicher dass dir heute nicht passt?",
        "Schade, sicher dass dir heute nicht passt?"
    ];
    let sometimeElse = [
        "Okay, dann lass uns morgen aber was machen",
        "Gut, dann meld dich, wenn du Zeit hast, würde mich freuen was mit dir zu unternehmen!",
        "Alles klar, können ja wann anders mal etwas machen"
    ];

    let whatToDo = [
        "Hmm.. Was könnte man denn so unternehmen..",
        "Lass mich mal überlegen, was man lustiges machen könnte..",
        "Ah, ich glaube, ich habe einige Ideen, was man machen könnte..!!"
    ];
    let howAboutCouponSelection = [
        "Wie wärs mit...",
        "Was hälst du von diesen Ideen...",
        "Was hälst du von meinen Ideen...",
        "Hört sich vielleicht eine Idee davon gut an..."
    ];
    let noCoupons = [
        "Mir fällt leider gerade nichts ein, schau aber gerne später nochmal vorbei!",
        "Hm ich komme gerade auf gar nichts... Vielleicht frag mich einfach später nochmal oder schreib Moritz schnell.",
        "Also mir fällt gerade nichts ein, aber vielleicht hat Moritz ja eine gute Idee wenn du ihn anschreibst."
    ];
    let toldMoritz = [
        "Okay, ich habe ihm gerade geschrieben, er meldet sich gleich bei dir!",
        "Hab ihm bescheid gegeben, er schreibt dir gleich!",
        "Hab ich an ihn weitergeleitet, er schreibt dir dann gleich!"
    ];

    let problems = [
        "Komisch, ich kann gerade Moritz gar nicht erreichen.. Scheint ein Problem zu geben, schreib ihm besser mal direkt.",
        "Irgendwie kann ich Moritz gerade nicht erreichen, schreib ihm besser mal direkt."
    ];

    // greeting
    let state = "greeting";
    let panda;
    let dialog;

    let dataPromise = api.main.data().then(r => {
        data = r.data;
        data.coupons = data.coupons.filter(c => !c.redeemed).map((v, i) => ({
            index: i,
            ...v
        }));

        dataStatus = "loaded";
    }).catch(err => {
        dataStatus = "error";
    });

    let data = null;
    let dataStatus = "notLoaded";
    let selectedCouponId = -1;

    function onMessageAnimateFinish() {
        if (state === "greeting") {
            panda.wiggle();

            state = "doSomethingQuestion";

            setTimeout(() => {
                dialog.showQuestion(doSomethingQuestions, [{ id: 0, msg: "Ja" }, { id: 1, msg: "Nein" }]);
            }, 2000);
        } else if (state === "whatToDo") {
            setTimeout(() => {
                if (dataStatus === "loaded") {
                    if (data.coupons.length < 1) {
                        dialog.showMessage(noCoupons);

                        state = "noCoupons";
                    } else {
                        dialog.showQuestion(howAboutCouponSelection, data.coupons.map(c => ({
                            id: c.id,
                            msg: c.name
                        })));

                        state = "couponSelection";
                    }
                } else {
                    state = "error";
                    dialog.showMessage(problems);
                }
            }, 1000);
        }
    }

    function onChooseAnswer(event) {
        panda.jump();
        const answer = event.detail;

        if (state === "doSomethingQuestion") {
            if (answer.id === 0) {
                dialog.showMessage(whatToDo);

                state = "whatToDo";
            } else {
                dialog.showQuestion(unsureQuestions, [{ id: 0, msg: "Vielleicht doch!" }, {
                    id: 1,
                    msg: "Ja, sicher"
                }]);
                state = "unsure";
            }
        } else if (state === "unsure") {
            if (answer.id === 0) {
                dialog.showMessage(whatToDo);

                state = "whatToDo";
            } else {
                dialog.showMessage(sometimeElse);

                state = "doNothing";
            }
        } else if (state === "couponSelection") {
            selectedCouponId = answer.id;

            state = "shouldTellMoritz";
            dialog.showQuestion(`Stimmt, "${answer.msg}" hört sich gut an! Soll ich Moritz schnell bescheid sagen?`, [{
                id: 0,
                msg: "Ja bitte"
            }, {
                id: 1,
                msg: "Nein, doch gerade nicht"
            }]);
        } else if (state === "shouldTellMoritz") {
            if (answer.id === 0) {
                api.main.redeem(selectedCouponId).then(r => {
                    dialog.showMessage(toldMoritz);

                    state = "done";

                    panda.wiggle();
                }).catch(err => {
                    state = "error";
                    dialog.showMessage(problems);
                });
            } else {
                dialog.showQuestion(unsureQuestions, [{ id: 0, msg: "Vielleicht doch!" }, {
                    id: 1,
                    msg: "Ja, sicher"
                }]);
                state = "unsure";
            }
        }
    }

    onMount(() => {
        dialog.showMessage(greetings);
    });
</script>

<div class="main-container d-flex justify-content-start align-items-center flex-column p-3">
    <div class="avatar-container mt-5">
        <Avatar bind:this={panda} />
    </div>
    <div>
        <Dialog bind:this={dialog} on:animateMessageFinish={onMessageAnimateFinish} on:chooseAnswer={onChooseAnswer} />
    </div>
</div>

<style>
    .main-container {
        height: 100vh;
    }

    .avatar-container {
        height: 40vh;
    }
</style>
