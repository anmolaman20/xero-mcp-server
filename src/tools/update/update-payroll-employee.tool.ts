import { z } from "zod";
import { updateXeroPayrollEmployee } from "../../handlers/update-xero-payroll-employee.handler.js";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";

const UpdatePayrollEmployeeTool = CreateXeroTool(
  "update-payroll-employee",
  "Update a payroll employee in Xero by their employee ID. You can update fields such as name, email, start date, and more.",
  {
    employeeId: z.string().describe("The Xero employee ID to update."),
    update: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      gender: z.string().optional(),
      startDate: z.string().optional(),
      title: z.string().optional(),
      phoneNumber: z.string().optional(),
      address: z.object({
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      }).optional(),
      // Add more fields as needed
    }).describe("Fields to update on the employee."),
  },
  async ({ employeeId, update }) => {
    const response = await updateXeroPayrollEmployee(employeeId, update);
    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error updating payroll employee: ${response.error}`,
          },
        ],
      };
    }
    const employee = response.result;
    return {
      content: [
        {
          type: "text" as const,
          text: `Payroll employee updated successfully. Employee ID: ${employee?.employeeID}`,
        },
      ],
    };
  }
);

export default UpdatePayrollEmployeeTool;
