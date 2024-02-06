<template>
  <div id="accordion-collapse">
    <AccordionItem
      v-for="(item, index) in items"
      :key="index"
      :index="index"
      :title="item.title"
      :content="item.content"
      :is-open="activeIndex === index"
      @toggle="handleToggle(index)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AccordionItem from "@/shared/components/AccordionItem.vue";

const items = [
  {
    title: "Take Profit",
    content: [
      {
        type: "text",
        value:
          "Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.",
      },
      {
        type: "link",
        value: "Check out this guide to learn how to get started.",
        href: "/docs/getting-started/introduction/",
      },
    ],
  },
];

const activeIndex = ref(null);

const handleToggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>
