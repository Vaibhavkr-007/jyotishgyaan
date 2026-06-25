import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function auth(req, res, next) {

    const authHeader = req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith('Bearer ')
    ) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
        });
    }

    try {

        const token =
            authHeader.split(' ')[1];

        const decoded =
            jwt.verify(token, JWT_SECRET);

        if (decoded.role === 'admin') {

            return res.status(403).json({

                success: false,

                error: 'Customer access required'

            });

        }

        req.user = decoded;

        next();

    } catch {

        return res.status(401).json({
            success: false,
            error: 'Invalid token',
        });

    }

}