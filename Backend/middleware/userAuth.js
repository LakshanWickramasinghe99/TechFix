/*
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized. login Again'});
    }

    try {

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.body.userId =  tokenDecode.id
        }else{
            return res({ success: false, message: 'Not Authorizes. Login Again' });
        }
            
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;
*/
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode?.id) {
            req.body.userId = tokenDecode.id;
            return next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    }
};

export default userAuth;
