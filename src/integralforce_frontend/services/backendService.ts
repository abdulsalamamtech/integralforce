import { integralforce_backend } from "../../declarations/integralforce_backend";

/**
 * Service for handling all integralforce_backend canister API calls
 */
export const backendService = {
  /**
   * Sends a greeting to the integralforce_backend and returns the response
   * @param name Name to greet
   * @returns Promise with the greeting response
   */
  async greet(name: string): Promise<string> {
    return await integralforce_backend.greet(name || "World");
  },

  /**
   * Fetches the current counter value
   * @returns Promise with the current count
   */
  async getCount(): Promise<bigint> {
    return await integralforce_backend.get_count();
  },

  /**
   * Increments the counter on the integralforce_backend
   * @returns Promise with the new count
   */
  async incrementCounter(): Promise<bigint> {
    return await integralforce_backend.increment();
  },

  /**
   * Sends a prompt to the LLM integralforce_backend
   * @param prompt The user's prompt text
   * @returns Promise with the LLM response
   */
  async sendLlmPrompt(prompt: string): Promise<string> {
    return await integralforce_backend.prompt(prompt);
  },
};