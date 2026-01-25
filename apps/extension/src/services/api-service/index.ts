import type { SummaryResponse } from "@hoverdocs/validators";

import type { AuthManager } from "../auth-manager";

import { config } from "../../config";
import { showToast } from "../../utils/toast";

export class ApiService {
  private authManager: AuthManager;
  private static readonly baseUrl = config.SERVER_API_URL;

  constructor(authManager: AuthManager) {
    this.authManager = authManager;
  }

  public async getSummary(
    code: string,
    context: string | undefined,
    languageId: string,
  ): Promise<SummaryResponse | null> {
    const token = await this.authManager.getToken();

    if (!token) {
      showToast("Authentication token is missing. Please log in.", { isError: true });
      return null;
    }

    try {
      const response = await fetch(`${ApiService.baseUrl}/api/ai-code/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ code, context, languageId }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null) as { message?: string } | null;
        const errorMessage = errorBody?.message || response.statusText;
        console.error("API Error:", errorMessage);
        showToast(errorMessage, { isError: true });
        return null;
      }

      const responseBody = await response.json() as { data: SummaryResponse };
      return responseBody.data;
    }
    catch (error) {
      console.error("Fetch Error:", error);
      showToast("Network error while fetching summary.", { isError: true });
      return null;
    }
  }
}
