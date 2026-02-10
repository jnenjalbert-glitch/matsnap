import ngrok from "ngrok";

const url = await ngrok.connect({ addr: 3000 });
console.log("\n===========================================");
console.log("  Open this URL on your phone:");
console.log(`  ${url}`);
console.log("===========================================\n");
console.log("Press Ctrl+C to stop the tunnel.\n");

// Keep process alive
process.stdin.resume();
