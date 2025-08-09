import { createClient } from "redis";

export class CacheService {
  private client: ReturnType<typeof createClient>;
  private isConnected = false;

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

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

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

export const cacheService = new CacheService();
