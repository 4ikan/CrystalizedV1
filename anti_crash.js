module.exports = () => {
    process.on("unhandledRejection", (reason, p) => {
         console.log("[ANTI-CRASH SYSTEM] :: Unhandled Rejection/Catch");
         console.log(reason, p);
     });
     process.on("uncaughtException", (err, origin) => {
         console.log("[ANTI-CRASH SYSTEM] :: Uncaught Exception/Catch");
         console.log(err, origin);
     }) 
     process.on("uncaughtExceptionMonitor", (err, origin) => {
         console.log("[ANTI-CRASH SYSTEM] :: Uncaught Exception/Catch (MONITOR)");
         console.log(err, origin);
     });
}