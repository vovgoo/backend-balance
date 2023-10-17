import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token){
        try{
            const decoded = jwt.verify(token, '>4]owql^}?qp{74)5*X~uz-he+gZ}L{}v1)mTwmQL@rY@;yL');
            req.userId = decoded._id;
            next();
        } catch(err){
            return res.status(403).json({
                message: "Нет доступа.",
            });
        }
    } else {
        return res.status(403).json({message: "Нет доступа."});
    }
}