import { z } from "zod";
import { deleteXeroPayrollEmployee } from "../../handlers/delete-xero-payroll-employee.handler.js";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";

const DeletePayrollEmployeeTool = CreateXeroTool(
  "delete-payroll-employee",
  "Delete a payroll employee in Xero by their employee ID.",
  {
    employeeId: z.string().describe("The Xero employee ID to delete."),
  },
  async ({ employeeId }) => {
    const response = await deleteXeroPayrollEmployee(employeeId);
    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error deleting payroll employee: ${response.error}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: `Payroll employee deleted successfully. Employee ID: ${employeeId}`,
        },
      ],
    };
  }
);

export default DeletePayrollEmployeeTool;
