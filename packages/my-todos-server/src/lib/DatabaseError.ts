class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    this.name = "DatabaseError";
  }
}

export default DatabaseError;
