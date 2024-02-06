<template>
  <div>
    <div>
      <div
        class="flex w-full items-center justify-between bg-base-100 p-3 text-gray-500"
      >
        <div class="flex items-center">
          <InfoIcon class="mr-2 size-5" />
          <span :class="textColorClass" class="text-base">{{ title }}</span>
        </div>
        <div class="flex items-center justify-center">
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              class="peer sr-only"
              :aria-expanded="!isOpen"
              @click="$emit('toggle')"
            />
            <span
              class="h-6 w-12 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-eastern-blue-600 peer-checked:after:translate-x-6"
            ></span>
          </label>
        </div>
      </div>
    </div>
    <div v-show="isOpen" class="bg-base-100 pb-4 pl-3 pr-3 pt-1">
      <TakeProfit />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import InfoIcon from "@/shared/icons/InfoIcon/InfoIcon.vue";
import TakeProfit from "@/components/TakeProfit.vue";

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    default: () => [],
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const textColorClass = computed(() =>
  props.isOpen ? "text-black font-medium" : "text-base-600",
);
</script>
