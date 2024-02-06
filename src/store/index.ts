import { reactive } from "vue";
import type { OrderSide } from "@/model.ts";

interface IErrorTargetProfit {
  profit: number;
  targetPrice: number;
  amount: number;
  _amount: number;
}

interface IStore {
  activeOrderSide: OrderSide;
  price: number;
  amount: number;
  errorsTargetProfit: IErrorTargetProfit[];
  total: () => number;
  setOrderSide: (side: OrderSide) => void;
  setPrice: (price: number) => void;
  setAmount: (amount: number) => void;
  setTotal: (total: number) => void;
}

export const store = reactive<IStore>({
  activeOrderSide: "buy",
  price: 10000,
  amount: 0.5,
  errorsTargetProfit: [],
  total(): number {
    return this.price * this.amount;
  },
  setOrderSide(side: OrderSide) {
    this.activeOrderSide = side;
  },
  setPrice(price: number) {
    this.price = price;
  },
  setAmount(amount: number) {
    this.amount = amount;
  },
  setTotal(total: number) {
    this.amount = this.price > 0 ? total / this.price : 0;
  },
});
