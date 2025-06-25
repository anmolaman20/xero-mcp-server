import { z } from "zod";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";
import { DeepLinkType, getDeepLink } from "../../helpers/get-deeplink.js";
import { ensureError } from "../../helpers/ensure-error.js";
import { Employee } from "xero-node/dist/gen/model/payroll-nz/employee.js";
import { xeroClient } from "../../clients/xero-client.js";

// Handler to create an employee in Xero Payroll
async function createXeroPayrollEmployee(params: any) {
  await xeroClient.authenticate();
  try {
    const response = await xeroClient.payrollNZApi.createEmployee(
      xeroClient.tenantId,
      { employees: [params] }
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

const CreatePayrollEmployeeTool = CreateXeroTool(
  "create-payroll-employee",
  "Create a new payroll employee in Xero. This allows you to specify details such as first name, last name, date of birth, email, gender, start date, and other employment details.",
  {
    firstName: z.string().describe("First name of the employee"),
    lastName: z.string().describe("Last name of the employee"),
    dateOfBirth: z.string().describe("Date of birth (YYYY-MM-DD)"),
    email: z.string().email().optional().describe("Email address of the employee"),
    gender: z.string().optional().describe("Gender of the employee (M/F/U)"),
    startDate: z.string().optional().describe("Employment start date (YYYY-MM-DD)"),
    title: z.string().optional().describe("Job title of the employee"),
    phoneNumber: z.string().optional().describe("Phone number of the employee"),
    address: z.object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    }).optional().describe("Address details of the employee"),
    // Add more fields as needed for full employee creation
  },
  async (params: any) => {
    const response = await createXeroPayrollEmployee(params);
    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error creating payroll employee: ${response.error}`,
          },
        ],
      };
    }
    const employee = response.result;
    // Optionally, generate a deep link if available
    return {
      content: [
        {
          type: "text" as const,
          text: `Payroll employee created successfully. Employee ID: ${employee?.employeeID}`,
        },
      ],
    };
  }
);

export default CreatePayrollEmployeeTool;
