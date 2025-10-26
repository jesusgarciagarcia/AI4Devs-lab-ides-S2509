/**
 * Wait for Database to be ready
 * Waits for PostgreSQL to be accepting connections
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const MAX_RETRIES = 30;
const RETRY_INTERVAL = 2000; // 2 seconds

async function checkDatabase() {
    try {
        // Try to connect to PostgreSQL using psql
        await execPromise(
            'docker exec $(docker ps -q -f "ancestor=postgres") pg_isready -U LTIdbUser -d LTIdb',
            { timeout: 5000 }
        );
        return true;
    } catch (error) {
        return false;
    }
}

async function waitForDatabase() {
    console.log('⏳ Waiting for database to be ready...');

    for (let i = 0; i < MAX_RETRIES; i++) {
        const isReady = await checkDatabase();

        if (isReady) {
            console.log('✅ Database is ready!');
            return;
        }

        console.log(`   Attempt ${i + 1}/${MAX_RETRIES} - Database not ready yet...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }

    throw new Error('❌ Database failed to be ready in time');
}

// Run if called directly
if (require.main === module) {
    waitForDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error.message);
            process.exit(1);
        });
}

module.exports = { waitForDatabase };
