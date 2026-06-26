import Pocketbase from 'pocketbase';
import logger from './logger.js';

const POCKETBASE_API_URL =
    import.meta.env.VITE_POCKETBASE_URL || "/pb";

const pbAdmin = new Pocketbase(POCKETBASE_API_URL);

export async function authenticateAdmin() {

    await pbAdmin
        .collection('_superusers')
        .authWithPassword(
            process.env.PB_SUPERUSER_EMAIL,
            process.env.PB_SUPERUSER_PASSWORD
        );

    logger.info(
        'PocketBase superuser authenticated'
    );
}

export default pbAdmin;