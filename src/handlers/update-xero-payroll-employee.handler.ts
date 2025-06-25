import { xeroClient } from "../../clients/xero-client.js";
import { ensureError } from "../../helpers/ensure-error.js";

// Update a payroll employee by ID
export async function updateXeroPayrollEmployee(employeeId: string, update: any) {
  await xeroClient.authenticate();
  try {
    const response = await xeroClient.payrollNZApi.updateEmployee(
      xeroClient.tenantId,
      employeeId,
      { employees: [update] }
    );
    const employee = response.body.employees?.[0];
    return {
      isError: false,
      result: employee,
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
