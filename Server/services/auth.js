const jwt = require("jsonwebtoken");

const seceret = "Any$eceret@!123";

function createTokenForUser(user) {
    const payload = {
        _id:user.id,
        email:user.email,
        fullName:user.fullName,
    };
    const token = jwt.sign(payload,seceret);
    return token;
};
function validateToken(token){
    const payload=jwt.verify(token,seceret);
    return payload;
};
module.exports={
    createTokenForUser,
    validateToken,
}