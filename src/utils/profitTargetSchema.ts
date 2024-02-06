import z from "zod";

// Define the schema for a profit target
export const UserSchema = z.object({
  profit: z.number().min(0.01, { message: "Minimum value is 0.01%" }),
  targetPrice: z.number().gt(0, { message: "Price must be greater than 0" }),
  amount: z.number(),
});

// Define the type for a profit target based on the schema
export type ProfitTarget = z.infer<typeof UserSchema>;

// Function to validate an array of profit targets
export const validateProfitTargets = (
  profitTargets: ProfitTarget[],
): Record<string, string> => {
  const totalProfit = profitTargets.reduce(
    (sum, target) => sum + target.profit,
    0,
  );
  const totalAmount = profitTargets.reduce(
    (sum, target) => sum + target.amount,
    0,
  );

  if (totalProfit > 500) {
    return { profit: "Maximum profit sum is 500%" };
  }

  const roundedTotalAmount = Math.round(totalAmount);

  if (roundedTotalAmount > 100) {
    return {
      amount: `${roundedTotalAmount} out of 100% selected. Please decrease by ${
        roundedTotalAmount - 100
      }`,
    };
  }

  if (roundedTotalAmount < 100) {
    return {
      amount: `${roundedTotalAmount} out of 100% selected. Please increase by ${
        100 - roundedTotalAmount
      }`,
    };
  }

  for (const [index, currentTarget] of profitTargets.entries()) {
    if (index > 0 && currentTarget.profit <= profitTargets[index - 1].profit) {
      return {
        profit: "Each target's profit should be greater than the previous one",
      };
    }
  }

  return {};
};
