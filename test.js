function simulateLongProcedure() {
    const total = 100;
    let completed = 0;

    const interval = setInterval(() => {
        completed += 1;
        process.stdout.write(`\rPercent completed: ${completed}%`);
        
        if (completed === total) {
            clearInterval(interval);
            console.log('\nProcedure completed!');
        }
    }, 100);
}

simulateLongProcedure();