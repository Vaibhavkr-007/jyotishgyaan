import express from "express";
import auth from "../middleware/auth.js";
import pbAdmin from "../utils/pocketbaseAdminClient.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage()
});

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

router.get("/", auth, async (req, res) => {

    try {

        const user =
            await pbAdmin
                .collection("users")
                .getOne(req.user.id);

        return res.json({

            success: true,

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                bio: user.bio,

                gender: user.gender,

                dateOfBirth: user.dateOfBirth,

                timeOfBirth: user.timeOfBirth,

                placeOfBirth: user.placeOfBirth,

                address: user.address,

                city: user.city,

                state: user.state,

                country: user.country,

                latitude: user.latitude,

                longitude: user.longitude,

                timezone: user.timezone,

                occupation: user.occupation,

                maritalStatus: user.maritalStatus,

                profile_picture: user.profile_picture

            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch profile."

        });

    }

});

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

router.put(
    "/",
    auth,
    upload.single("profile_picture"),
    async (req, res) => {

        try {

            const body = {

                name: req.body.name,
                phone: req.body.phone,
                bio: req.body.bio,

                gender: req.body.gender,

                dateOfBirth: req.body.dateOfBirth,
                timeOfBirth: req.body.timeOfBirth,
                placeOfBirth: req.body.placeOfBirth,

                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,

                latitude: req.body.latitude,
                longitude: req.body.longitude,
                timezone: req.body.timezone,

                occupation: req.body.occupation,
                maritalStatus: req.body.maritalStatus

            };

            if (req.file) {

                const formData = new FormData();

                Object.entries(body).forEach(([k, v]) => {

                    if (v !== undefined && v !== null) {
                        formData.append(k, v);
                    }

                });

                const blob = new Blob(
                    [req.file.buffer],
                    {
                        type: req.file.mimetype
                    }
                );

                formData.append(
                    "profile_picture",
                    blob,
                    req.file.originalname
                );

                const updated =
                    await pbAdmin
                        .collection("users")
                        .update(
                            req.user.id,
                            formData
                        );

                return res.json({

                    success: true,
                    user: updated

                });

            }

            const updated =
                await pbAdmin
                    .collection("users")
                    .update(
                        req.user.id,
                        body
                    );

            return res.json({

                success: true,
                user: updated

            });

        }

        catch (err) {

            console.error("PROFILE UPDATE ERROR");
            console.error(err);

            if (err.response) {
                console.error(err.response);
            }

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }
);

router.post(
    "/picture",
    auth,
    upload.single("profile_picture"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message: "No image uploaded."

                });

            }

            const blob = new Blob(
                [req.file.buffer],
                { type: req.file.mimetype }
            );

            const formData = new FormData();

            formData.append(
                "profile_picture",
                blob,
                req.file.originalname
            );

            const updatedUser =
                await pbAdmin
                    .collection("users")
                    .update(
                        req.user.id,
                        formData
                    );

            return res.json({

                success: true,

                profile_picture:
                    updatedUser.profile_picture

            });

        }

        catch (err) {

            console.error(err);

            return res.status(500).json({

                success: false,

                message:
                    "Unable to upload profile picture."

            });

        }

    }
);

router.delete(
    "/picture",
    auth,
    async (req, res) => {

        try {

            await pbAdmin
                .collection("users")
                .update(
                    req.user.id,
                    {

                        profile_picture: null

                    }
                );

            return res.json({

                success: true

            });

        }

        catch (err) {

            console.error(err);

            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete picture."

            });

        }

    }
);

export default router;