<script setup lang="ts">
import { computed } from "vue";
import { store } from "@/store";
import TargetInput from "@/shared/components/TargetInput.vue";
import FieldError from "@/shared/components/FieldError.vue";
import CloseIcon from "@/shared/icons/CloseIcon/CloseIcon.vue";
import AddProfitTargetIcon from "@/shared/icons/AddProfitTargetIcon/AddProfitTargetIcon.vue";
import {
  validateForm,
  profitTargets,
  recalculateAmounts,
} from "@/utils/formValidation";

interface ProfitTarget {
  profit: number;
  targetPrice: number;
  amount: number;
  _amount: number;
}

const addProfitTarget = () => {
  const lastProfit = profitTargets[profitTargets.length - 1]?.profit || 0;
  const newTarget = {
    profit: lastProfit + 2,
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
    _amount: 0,
  };

  profitTargets.push(newTarget);
  recalculateAmounts();
  validateForm();
};

const updateField = (index: number, key: keyof ProfitTarget, event: number) => {
  profitTargets[index][key] = event;
  validateForm();
};

const removeTarget = (index: number) => {
  profitTargets.splice(index, 1);
  recalculateAmounts();
  validateForm();
};

const projectedProfit = computed(() => {
  return profitTargets.reduce(
    (sum: number, current: Record<string, number>) =>
      store.activeOrderSide === "buy"
        ? sum + store.amount * (current.targetPrice - store.price)
        : sum + store.amount * (store.price - current.targetPrice),
    0,
  );
});
</script>

<template>
  <div class="rounded-lg">
    <div
      v-if="profitTargets.length > 0"
      class="grid grid-cols-[auto_auto_auto] gap-2"
    >
      <div class="text-xs font-medium text-gray-600">Profit</div>
      <div class="text-xs font-medium text-gray-600">Target price</div>
      <div class="text-xs font-medium text-gray-600">
        {{
          store.activeOrderSide === "buy" ? "Amount to sell" : "Amount to buy"
        }}
      </div>
      <template v-for="(target, index) in profitTargets" :key="index">
        <div
          class="flex text-sm"
          :class="
            !!store.errorsTargetProfit[index]?.profit
              ? 'text-red-500'
              : 'text-black'
          "
        >
          <TargetInput
            v-model="target.profit"
            @update:modelValue="updateField(index, 'profit', $event)"
            class="w-8"
          />
          %
        </div>
        <div
          class="flex text-sm"
          :class="
            !!store.errorsTargetProfit[index]?.targetPrice
              ? 'text-red-500'
              : 'text-black'
          "
        >
          <TargetInput
            v-model="target.targetPrice"
            @update:modelValue="updateField(index, 'targetPrice', $event)"
            class="w-14"
          />
          <div>USDT</div>
        </div>
        <div class="flex justify-between text-sm">
          <div
            class="flex"
            :class="
              !!store.errorsTargetProfit[index]?.amount
                ? 'text-red-500'
                : 'text-black'
            "
          >
            <TargetInput
              v-model="target.amount"
              @update:modelValue="updateField(index, 'amount', $event)"
              class="w-8"
            />
            %
          </div>
          <button
            @click.prevent="removeTarget(index)"
            class="text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>
      </template>
    </div>

    <FieldError v-if="profitTargets.length > 0" />

    <div :class="profitTargets.length > 0 ? 'mt-4' : 'mt-0'">
      <button
        v-if="profitTargets.length < 5"
        @click.prevent="addProfitTarget"
        class="flex items-center text-xs text-eastern-blue-600 hover:text-eastern-blue-700"
      >
        <AddProfitTargetIcon />

        <span class="ml-2 text-xs font-medium">
          Add profit target {{ profitTargets.length }} / 5
        </span>
      </button>
    </div>

    <div class="mt-4 flex justify-between text-sm text-gray-600">
      <div>Projected profit:</div>
      <div class="flex flex-grow items-end">
        <div
          class="mx-2 flex-grow border-t border-dotted border-gray-400"
        ></div>
      </div>
      <div>
        <span class="font-medium text-black">{{
          projectedProfit.toFixed(0)
        }}</span>
        USDT
      </div>
    </div>
  </div>
</template>
