<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    data?: Record<string, number>; // Can be empty or undefined
    weeks?: number;
}>();

// Default to 20 weeks if not provided
const weeks = computed(() => props.weeks || 20);

// Generate the last X weeks of dates
function generateDates(weeks: number) {
    const days = weeks * 7;
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (days - 1 - i));
        const dateStr = d.toISOString().split("T")[0];
        const count = props.data?.[dateStr] || 0;
        return { date: dateStr, count };
    });
}

const dates = computed(() => generateDates(weeks.value));

// Group by weeks (columns)
const grouped = computed(() => {
    return Array.from({ length: weeks.value }, (_, i) =>
        dates.value.slice(i * 7, (i + 1) * 7),
    );
});

// Determine intensity color
function getColor(count: number) {
    if (count === 0) return "bg-gray-800 dark:bg-gray-700";
    if (count < 2) return "bg-green-900 dark:bg-green-800";
    if (count < 4) return "bg-green-700 dark:bg-green-600";
    if (count < 6) return "bg-green-500 dark:bg-green-400";
    return "bg-green-300 dark:bg-green-300";
}
</script>

<template>
    <UCard variant="outline" class="w-fit mx-auto my-4">
        <h1 class="text-xl">
            Activity Grid
        </h1>
        <div class="w-max flex gap-1 overflow-hidden">
            <div
                v-for="(week, wi) in grouped"
                :key="wi"
                class="flex flex-col gap-1"
            >
                <UTooltip
                    v-for="(day, di) in week"
                    :key="di"
                    :delay="100"
                    placement="right"
                    :text="`${day.date} - ${day.count} Done`"
                    :content="{side: 'right'}"
                    :ui="{text: 'text-base'}"
                >
                    <div
                        :class="[
                            'w-10 h-10 rounded-sm transition-all duration-200 hover:scale-110',
                            getColor(day.count),
                        ]"
                    />
                </UTooltip>
            </div>
        </div>

        <div
            v-if="!props.data || Object.keys(props.data).length === 0"
            class="text-sm text-gray-400 mt-3"
        >
            No activity data yet — start completing your habits!
        </div>
    </UCard>
</template>
