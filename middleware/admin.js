const JWT_SECRET_Admin = process.env.JWT_SECRET_Admin || 'asdxasdxajtdmwajtdmw';
const jwt = require('jsonwebtoken');
const errorHandler = require("../utils/error_handler");

const admin = async (req, res, next) => {
    try {
        const token = req.header('token');
        console.log("Received Token:", token);

        if (!token) return res.status(401).json({ msg: "No token available" });

        const verified = jwt.verify(token, JWT_SECRET_Admin);
        console.log("Verified User ID:", verified.id);
        if (!verified) return res.status(401).json({ msg: "Token verification failed" });

        req.user = { id: verified.id };
        req.token = token;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: " Server error" });
    }
};

module.exports = admin;