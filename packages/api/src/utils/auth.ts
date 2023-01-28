import bcrypt from 'bcryptjs'

export function hash(password: string) {
    return bcrypt.hash(password, 10)
}

export async function verify(password: string, hashed: string) {
    return bcrypt.compare(password, hashed)
}