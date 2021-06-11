<script>
    import { _ } from "svelte-i18n";
    import { Router, Route } from "svelte-routing";
    import { Container } from "sveltestrap";
    import api from "./api/api";
    import { authInitialized, loggedIn } from "./stores";
    import Main from "./routes/Main.svelte";

    if (!$authInitialized) {
        $authInitialized = true;
        $loggedIn = api.loadAuth();
    }
</script>

<Router basepath="/">
    <Container>
        <Route component={Main} path="/" />
    </Container>
</Router>

<style global src="../scss/main.scss"></style>
