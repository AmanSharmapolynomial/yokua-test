// global catchasync for api calls
const catchAsync = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(err => console.log(err))
}

export default catchAsync
