const { showMemoryUsage, usagePercent } = require("node-system-stats");

const main = async () => {
    try {
            result = await usagePercent();
        console.log(`CPU usage: ${result.percent}%, measured over ${result.seconds} seconds`);
    const memUsage = showMemoryUsage();
console.log("Memory usage:", memUsage);
    } catch (e) {
        console.log(e)
    }
}

main();