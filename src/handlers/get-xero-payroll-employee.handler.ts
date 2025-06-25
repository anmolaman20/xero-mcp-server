import { xeroClient } from "../../clients/xero-client.js";
import { ensureError } from "../../helpers/ensure-error.js";
import { Employee } from "xero-node/dist/gen/model/payroll-nz/employee.js";

// Get a single payroll employee by ID
export async function getXeroPayrollEmployee(employeeId: string) {
  await xeroClient.authenticate();
  try {
    const response = await xeroClient.payrollNZApi.getEmployee(
      xeroClient.tenantId,
      employeeId
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
