export function auth(req, res, next) {
    console.log(req.session?.user?.admin)
    if(req.session?.user?.admin) {
        return next()
    }

    return res.status(401).send('error de autorización')
}