/**
 * Custom error class for invalid pagination cursor errors
 * Thrown when a pagination cursor cannot be parsed or has invalid format
 */
export class InvalidCursorError extends Error {
  /**
   * Creates an instance of InvalidCursorError
   * @param {string} message - Error message describing the invalid cursor
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCursorError';
  }
}
