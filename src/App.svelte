<script>
    import { Router, Route } from "svelte-routing";
    import { Container } from "sveltestrap";
    import Main from "./routes/Main.svelte";
</script>

<Router basepath="/">
    <Container>
        <Route component={Main} path="/" />
    </Container>
</Router>

<style global src="../scss/main.scss"></style>
