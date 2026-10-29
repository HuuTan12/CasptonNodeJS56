export const responseSuccess = (content = null, message = "Xử lý thành công!", statusCode = 200) => {
  return {
    statusCode,
    message,
    content,
    dateTime: new Date().toISOString(),
  };
};

export const responseError = (message = "Đã có lỗi xảy ra", statusCode = 500, stack = null) => {
  return {
    statusCode,
    message,
    content: null,
    dateTime: new Date().toISOString(),
    ...(stack && process.env.NODE_ENV !== "production" ? { stack } : {}),
  };
};

