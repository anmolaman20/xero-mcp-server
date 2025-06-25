import { z } from "zod";
import { getXeroPayrollEmployee } from "../../handlers/get-xero-payroll-employee.handler.js";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";

const GetPayrollEmployeeTool = CreateXeroTool(
  "get-payroll-employee",
  "Get a single payroll employee by their Xero employee ID.",
  {
    employeeId: z.string().describe("The Xero employee ID to fetch."),
  },
  async ({ employeeId }) => {
    const response = await getXeroPayrollEmployee(employeeId);
    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error fetching payroll employee: ${response.error}`,
          },
        ],
      };
    }
    const employee = response.result;
    return {
      content: [
        {
          type: "text" as const,
          text: `Payroll employee: ${employee?.employeeID}\nName: ${employee?.firstName} ${employee?.lastName}`,
        },
      ],
    };
  }
);

export default GetPayrollEmployeeTool;
