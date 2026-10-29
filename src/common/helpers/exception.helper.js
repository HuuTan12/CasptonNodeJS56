export class AppException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestException extends AppException {
  constructor(message = "Dữ liệu không hợp lệ") {
    super(message, 400);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = "Bạn chưa đăng nhập") {
    super(message, 401);
  }
}

export class ForbiddenException extends AppException {
  constructor(message = "Bạn không có quyền thực hiện thao tác này") {
    super(message, 403);
  }
}

export class NotFoundException extends AppException {
  constructor(message = "Không tìm thấy dữ liệu") {
    super(message, 404);
  }
}

