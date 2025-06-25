import { xeroClient } from "../../clients/xero-client.js";
import { ensureError } from "../../helpers/ensure-error.js";

// Delete a payroll employee by ID
export async function deleteXeroPayrollEmployee(employeeId: string) {
  await xeroClient.authenticate();
  try {
    await xeroClient.payrollNZApi.deleteEmployee(
      xeroClient.tenantId,
      employeeId
    );
    return {
      isError: false,
      result: true,
      error: null,
    };
  } catch (error) {
    return {
      isError: true,
      result: null,
      error: ensureError(error).message,
    };
  }
}
