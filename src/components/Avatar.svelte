<script>
    import { tweened } from "svelte/motion";
    import { elasticIn, elasticInOut, elasticOut, bounceInOut } from "svelte/easing";

    const elevation = tweened(0, {
        duration: 200,
        easing: bounceInOut
    });

    const rotation = tweened(0.5, {
        duration: 200,
        easing: elasticInOut
    });

    export function jump() {
        $elevation = 1;
        setTimeout(() => $elevation = 0, 200);
    }

    export function wiggle() {
        jump();
        $rotation = 1;
        setTimeout(() => $rotation = 0, 400);
        setTimeout(() => $rotation = 0.5, 800);
    }
</script>

<img id="panda" src="/assets/panda.svg" on:click={wiggle} style="transform: translateY(-{$elevation * 30}px) scale({100 + $elevation * 5}%) rotateZ({$rotation * 40 - 20}deg); filter: drop-shadow(6px {$elevation * 12 + 6}px 0 rgba(0, 0, 0, {0.6 - $elevation * 0.6}))" />

<style>
    #panda {
        transition: all 0.3s;
        width: 50vw;;
    }
</style>
