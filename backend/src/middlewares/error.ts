export function errorHandler(
  err:any,
  req:any,
  res:any,
  next:any
){
  res.status(err.status || 500).json({
    code:err.status || 500,
    message:err.message || "Server error",
    details:err
  });
}