<template>
  <div v-for="(_, index) in store.errorsTargetProfit" :key="index">
    <div v-if="store.errorsTargetProfit[index]">
      <p
        v-if="store.errorsTargetProfit[index].profit"
        class="mt-3 border-2 border-red-400 bg-red-50 px-3 py-2 text-xs text-red-400"
      >
        {{ store.errorsTargetProfit[index].profit }}
      </p>
      <p
        v-if="store.errorsTargetProfit[index].targetPrice"
        class="mt-3 border-2 border-red-400 bg-red-50 px-3 py-2 text-xs text-red-400"
      >
        {{ store.errorsTargetProfit[index].targetPrice }}
      </p>
      <p
        v-if="store.errorsTargetProfit[index].amount"
        class="mt-3 border-2 border-red-400 bg-red-50 px-3 py-2 text-xs text-red-400"
      >
        {{ store.errorsTargetProfit[index].amount }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "@/store";
</script>
