class AppError {
  public readonly message: string;

  public readonly statusCode?: number;

  constructor({ message, statusCode = 400 }: AppError) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
