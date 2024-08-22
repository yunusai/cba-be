const logRequest = (req, res, next) => {
    console.log('log req ke PATH: ', req.path);
    next();
}

export default logRequest
