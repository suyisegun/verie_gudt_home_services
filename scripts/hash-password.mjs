// Generates a bcrypt hash for PORTAL_ADMIN_PASSWORD_HASH.
// Usage: node scripts/hash-password.mjs "your-chosen-password"
import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-chosen-password"')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)

// Next.js's env loader expands `$name` sequences in .env files (for referencing other vars),
// which silently corrupts bcrypt hashes since they're full of literal `$` characters. Escaping
// each one as `\$` makes Next.js resolve it back to the original hash. Do not paste the raw
// hash from bcrypt.hashSync() directly into .env.local without this escaping — login will fail
// with no obvious error.
const escapedForEnvFile = hash.replaceAll('$', '\\$')

console.log('\nAdd this to your .env.local:\n')
console.log(`PORTAL_ADMIN_PASSWORD_HASH="${escapedForEnvFile}"\n`)
