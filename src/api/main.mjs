export default function(axios) {
    const data = () => axios.get("/data");
    const redeem = (id) => axios.get("/redeem/" + id);

    return {
        data, redeem
    };
}
