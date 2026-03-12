const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('theme_check_output_utf8.json', 'utf8'));
    const summary = {};
    let totalErrors = 0;
    let totalWarnings = 0;

    data.forEach(file => {
        file.offenses.forEach(offense => {
            if (!summary[offense.check]) {
                summary[offense.check] = { count: 0, severity: offense.severity, message: offense.message };
            }
            summary[offense.check].count++;

            if (offense.severity === 'error') totalErrors++;
            if (offense.severity === 'warning') totalWarnings++;
        });
    });

    console.log('=== Theme Check Summary ===');
    console.log(`Total Errors: ${totalErrors}`);
    console.log(`Total Warnings: ${totalWarnings}`);
    console.log('\nBreakdown by Rule:');

    // Sort by count descending
    const sortedRules = Object.keys(summary).sort((a, b) => summary[b].count - summary[a].count);
    sortedRules.forEach(rule => {
        const s = summary[rule];
        console.log(`- [${s.severity.toUpperCase()}] ${rule}: ${s.count} occurrences`);
        console.log(`  Example: ${s.message}`);
    });
} catch (e) {
    console.error("Error parsing JSON:", e);
}
