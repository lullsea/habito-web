<script lang="ts" setup>
const x = [1, 2, 3, 5, 5];
const sampleData = ref([
    {
        id: 1,
        user_id: 1,
        title: "Finish writing report",
        description: "Complete the project report for the client meeting",
        is_completed: false,
        due_date: "2025-11-10",
    },
    {
        id: 2,
        user_id: 1,
        title: "Workout session",
        description: "Go for a 1-hour strength training workout at the gym",
        is_completed: true,
        due_date: "2025-11-05",
    },
    {
        id: 3,
        user_id: 2,
        title: "Buy groceries",
        description: "Purchase milk, eggs, and vegetables for the week",
        is_completed: false,
        due_date: "2025-11-07",
    },
    {
        id: 4,
        user_id: 3,
        title: "Read new book",
        description: "Start reading 'Atomic Habits' by James Clear",
        is_completed: false,
        due_date: "2025-11-15",
    },
    {
        id:5,
        user_id: 1,
        title: "Pay utility bills",
        description: "Settle electricity and water bills before the deadline",
        is_completed: true,
        due_date: "2025-11-01",
    },
]);


// Handlers
const handleDelete = (id: number) => {
    sampleData.value = sampleData.value.filter(item => item.id !== id);
}
</script>

<template>
    <UCard variant="outline" class="flex-1 min-w-140 h-130 overflow-y-auto">
        <h3 class="text-lg mb-4">Todo</h3>

        <div class="flex flex-col gap-2">
            <Todo v-for="(item, index) in sampleData" :key="item.id" :data="item" @delete="handleDelete"/>
        </div>
    </UCard>
</template>
