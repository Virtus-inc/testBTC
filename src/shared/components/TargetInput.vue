<script setup lang="ts">
import { defineProps, defineEmits, PropType } from "vue";

defineProps({
  modelValue: {
    type: Number as PropType<number>,
    default: NaN,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);

  if (isNaN(value)) {
    emit("update:modelValue", NaN);
  } else {
    emit("update:modelValue", value);
  }
};
</script>

<template>
  <div>
    <input
      type="number"
      class="flex overflow-hidden whitespace-nowrap bg-base-100 outline-none focus:bg-base-200 focus:outline-none group-hover:bg-base-200"
      v-bind="$attrs"
      :value="modelValue"
      @blur="handleInput($event)"
    />
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
