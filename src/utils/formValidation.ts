import { reactive } from "vue";
import { store } from "@/store";
import { validateProfitTargets, UserSchema } from "@/utils/profitTargetSchema";

interface ProfitTarget {
  profit: number;
  targetPrice: number;
  amount: number;
  _amount: number;
}

export const profitTargets = reactive<ProfitTarget[]>([
  {
    profit: 2,
    get targetPrice() {
      return store.activeOrderSide === "buy"
        ? Number((store.price * (1 + this.profit / 100)).toFixed(0)) || 0
        : Number((store.price * (1 - this.profit / 100)).toFixed(0)) || 0;
    },
    set targetPrice(value) {
      if (store.activeOrderSide === "buy") {
        this.profit = Number(((value / store.price - 1) * 100).toFixed(0));
      } else {
        this.profit = Number(((1 - value / store.price) * 100).toFixed(0));
      }
    },
    get amount() {
      return this._amount;
    },
    set amount(value) {
      this._amount = value;
      recalculateAmounts();
    },
    _amount: 100,
  },
]);

export const recalculateAmounts = (): void => {
  const totalAmount = profitTargets.reduce(
    (sum, target) => sum + target._amount,
    0,
  );
  const targetAmount = 100 / profitTargets.length;

  if (totalAmount !== 100) {
    profitTargets.forEach((target) => {
      target._amount = Number(targetAmount.toFixed(1));
    });
  }
};

export const validateForm = (): void => {
  store.errorsTargetProfit = [];

  profitTargets.forEach((target, index) => {
    try {
      UserSchema.parse({
        profit: Number(target.profit),
        targetPrice: Number(target.targetPrice),
        amount: Number(target.amount),
        _amount: Number(target._amount),
      });
      store.errorsTargetProfit[index] = {
        profit: 0,
        targetPrice: 0,
        amount: 0,
        _amount: 0,
      };
    } catch (err: any) {
      const formattedErrors = err.format?.();
      store.errorsTargetProfit[index] = {
        profit: formattedErrors?.profit?._errors?.[0] || 0,
        targetPrice: formattedErrors?.targetPrice?._errors?.[0] || 0,
        amount: formattedErrors?.amount?._errors?.[0] || 0,
        _amount: formattedErrors?._amount?._errors?.[0] || 0,
      };
    }
  });

  const additionalErrors = validateProfitTargets(profitTargets);
  if (Object.keys(additionalErrors).length > 0) {
    Object.entries(additionalErrors).forEach(([key, value]) => {
      store.errorsTargetProfit.push({
        profit: key === "profit" ? Number(value) : 0,
        targetPrice: key === "targetPrice" ? Number(value) : 0,
        amount: key === "amount" ? Number(value) : 0,
        _amount: key === "_amount" ? Number(value) : 0,
      });
    });
  }
};
