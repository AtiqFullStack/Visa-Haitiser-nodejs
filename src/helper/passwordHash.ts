import bcrypt from 'bcrypt'
import { SALT_ROUND } from '../utils/cofig';

export const passwordHash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUND);
}

export const passwordCompare = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}