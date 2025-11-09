
<script setup lang="ts">

interface Todo{
    id: number;
    title: string;
    description: string;
    is_completed: boolean;
    due_date: Date;
}

// Define component props
const props = defineProps<{
    data: Todo;
}>();

// Refs
const data = ref(props.data);

// Handlers / Emits

const emit = defineEmits(['delete']);

function handleDelete(){
    emit('delete', data.value.id);
}

</script>

<template>
    <UCard :ui="{body: 'flex gap-1'}">
        <UCheckbox size="xl" v-model="data.is_completed" :label="data.title"/>
        <UButton @click.prevent="handleDelete" class="ml-auto" color="error">Delete</UButton>
    </UCard>
</template>
