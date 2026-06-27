import express from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger.js';
import adminAuth from '../../middleware/adminAuth.js';
import pbAdmin from '../../utils/pocketbaseAdminClient.js';
import PocketBase from 'pocketbase';

const router = express.Router();

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

logger.info('[AUTH] Admin auth module loaded');

// POST /admin/auth/login - Admin login
router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                error: "Email and password are required"
            });

        }

        const pb =
            new PocketBase(
                "http://127.0.0.1:8090"
            );

        const authData =
            await pb
                .collection('admins')
                .authWithPassword(
                    email,
                    password
                );

        const admin =
            authData.record;

        if (!admin.verified) {

            return res.status(403).json({
                error: "Email is not verified"
            });

        }

        if (!admin.isActive) {

            return res.status(403).json({
                error: "Admin account is disabled"
            });

        }

        const token =
            jwt.sign(

                {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: JWT_EXPIRY
                }

            );

        return res.json({

            success: true,

            token,

            user: {

                id: admin.id,

                email: admin.email,

                role: admin.role,

                name: admin.name

            }

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(401).json({

            error:
                "Invalid email or password"

        });

    }

});

// GET /admin/auth/verify-session - Verify JWT token and return user info
router.get('/verify-session', async (req, res) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith('Bearer ')
        ) {

            return res.status(401).json({

                error:
                    'Missing authorization header'

            });

        }

        const token =
            authHeader.split(' ')[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const admin =
            await pbAdmin
                .collection('admins')
                .getOne(decoded.id);

        if (!admin.verified) {

            return res.status(403).json({

                error:
                    'Email is not verified'

            });

        }

        if (!admin.isActive) {

            return res.status(403).json({

                error:
                    'Admin account is disabled'

            });

        }

        return res.json({

            success: true,

            user: {

                id: admin.id,

                email: admin.email,

                name: admin.name,

                role: admin.role,

                isActive: admin.isActive

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(401).json({

            error:
                'Invalid or expired token'

        });

    }

});

router.get(
    '/verify',
    adminAuth,
    async (req, res) => {

        return res.json({

            success: true,

            user: req.user,

        });

    }
);

export default router;
