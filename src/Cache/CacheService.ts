import { createClient } from "redis";

/**
 * Redis cache service for managing cached API responses
 * Provides methods for connecting, disconnecting, and managing cache entries
 */
export class CacheService {
  private client: ReturnType<typeof createClient>;
  private isConnected = false;

  /**
   * Initializes Redis client with connection handlers
   * Uses REDIS_URL environment variable for connection string
   */
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      console.log("Redis Client Connected");
      this.isConnected = true;
    });
  }

  /**
   * Establishes connection to Redis server
   * @returns {Promise<void>} Resolves when connection is established
   */
  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  /**
   * Closes connection to Redis server
   * @returns {Promise<void>} Resolves when disconnection is complete
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Retrieves a value from cache by key
   * @param {string} key - Cache key to retrieve
   * @returns {Promise<string | null>} Cached value or null if not found/error
   */
  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        console.warn("Redis not connected, skipping cache get");
        return null;
      }
      return await this.client.get(key);
    } catch (error) {
      console.error("Error getting from cache:", error);
      return null;
    }
  }

  /**
   * Stores a value in cache with expiration
   * @param {string} key - Cache key to store value under
   * @param {string} value - Value to cache (must be string)
   * @param {number} ttlSeconds - Time to live in seconds (default: 3600)
   * @returns {Promise<void>} Resolves when value is stored
   */
  async set(
    key: string,
    value: string,
    ttlSeconds: number = 3600,
  ): Promise<void> {
    try {
      if (!this.isConnected) {
        console.warn("Redis not connected, skipping cache set");
        return;
      }
      await this.client.set(key, value, {
        EX: ttlSeconds,
      });
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }

  /**
   * Removes a key from cache
   * @param {string} key - Cache key to delete
   * @returns {Promise<void>} Resolves when key is deleted
   */
  async delete(key: string): Promise<void> {
    try {
      if (!this.isConnected) {
        console.warn("Redis not connected, skipping cache delete");
        return;
      }
      await this.client.del(key);
    } catch (error) {
      console.error("Error deleting from cache:", error);
    }
  }

  /**
   * Clears all keys from the current Redis database
   * @returns {Promise<void>} Resolves when database is flushed
   */
  async flush(): Promise<void> {
    try {
      if (!this.isConnected) {
        console.warn("Redis not connected, skipping cache flush");
        return;
      }
      await this.client.flushDb();
    } catch (error) {
      console.error("Error flushing cache:", error);
    }
  }
}
