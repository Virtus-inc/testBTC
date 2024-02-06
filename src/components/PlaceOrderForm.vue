<script setup lang="ts">
import { computed } from "vue";
import NumberInput from "@/shared/components/NumberInput/NumberInput.vue";
import Accordion from "@/components/Accordion.vue";
import Button from "@/shared/components/Button/Button.vue";
import { BASE_CURRENCY, QUOTE_CURRENCY } from "@/constants.ts";
import { store } from "@/store";
import PlaceOrderTypeSwitch from "@/components/PlaceOrderTypeSwitch.vue";
import InfoIcon from "@/shared/icons/InfoIcon/InfoIcon.vue";
import { validateForm } from "@/utils/formValidation";

interface IErrorTargetProfit {
  profit: number;
  targetPrice: number;
  amount: number;
}

const submitButtonText = computed(() => {
  return store.activeOrderSide === "buy"
    ? `Buy ${BASE_CURRENCY}`
    : `Sell ${QUOTE_CURRENCY}`;
});

const hasErrors = (): boolean => {
  return store.errorsTargetProfit.some(
    (error: IErrorTargetProfit) =>
      error.profit || error.targetPrice || error.amount,
  );
};

const submit = () => {
  validateForm();
  console.log("submit");
};
</script>

<template>
  <form method="post" @submit="submit" class="grid gap-4">
    <div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-base-600">Market direction</span>
        <InfoIcon class="size-4" />
      </div>

      <PlaceOrderTypeSwitch
        class="mt-2"
        :modelValue="store.activeOrderSide"
        @update:modelValue="store.setOrderSide($event)"
      />
    </div>
    <div>
      <NumberInput
        id="price"
        :label="`Price, ${QUOTE_CURRENCY}`"
        :modelValue="store.price"
        @update:modelValue="store.setPrice($event)"
        autofocus
      />
    </div>
    <div>
      <NumberInput
        id="amount"
        :label="`Amount, ${BASE_CURRENCY}`"
        :modelValue="store.amount"
        @update:modelValue="store.setAmount($event)"
      />
    </div>
    <div>
      <NumberInput
        id="total"
        :label="`Total, ${QUOTE_CURRENCY}`"
        :modelValue="store.total()"
        @update:modelValue="store.setTotal($event)"
      />
    </div>

    <Accordion />

    <div>
      <Button
        type="submit"
        variant="accent"
        :full-width="true"
        :disabled="hasErrors()"
        @click.prevent
      >
        {{ submitButtonText }}
      </Button>
    </div>
  </form>
</template>
