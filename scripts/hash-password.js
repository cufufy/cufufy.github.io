import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
    console.error('Usage: node scripts/hash-password.js <password>');
    process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log('\nUse this hash in your SQL insert statement.');
