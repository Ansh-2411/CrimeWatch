const { validateToken } = require("../services/auth");
function checkForAuthenticatioCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]; // Corrected syntax

        if (!tokenCookieValue) {
            return next(); // No cookie, proceed to next middleware
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload; // Attach user data to req
        } catch (error) {
            console.error("Token validation error:", error);
        }

        return next();
    };
};

module.exports={
    checkForAuthenticatioCookie,
}