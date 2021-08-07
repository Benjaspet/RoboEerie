module.exports = {
    name: "ready",
    once: true,
    execute(client) {

        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);

    },
};