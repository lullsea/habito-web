<script setup>
import axios from "axios";
import useAuth from "~/composables/useAuth";

const config = useRuntimeConfig();
const { $axios } = useNuxtApp();
const { login, fetchUser, register, logout, user} = useAuth();

const sampleData = {
    "2025-08-28": 2,
    "2025-08-30": 3,
    "2025-09-01": 1,
    "2025-09-02": 4,
    "2025-09-05": 2,
    "2025-09-07": 3,
    "2025-09-08": 1,
    "2025-09-09": 5,
    "2025-09-11": 2,
    "2025-09-12": 4,
    "2025-09-14": 1,
    "2025-09-16": 6,
    "2025-09-20": 2,
    "2025-09-22": 3,
    "2025-09-24": 5,
    "2025-09-26": 1,
    "2025-09-29": 4,
    "2025-10-01": 3,
    "2025-10-02": 4,
    "2025-10-04": 2,
    "2025-10-05": 5,
    "2025-10-07": 3,
    "2025-10-08": 6,
    "2025-10-10": 1,
    "2025-10-13": 2,
    "2025-10-15": 3,
    "2025-10-18": 4,
    "2025-10-20": 5,
    "2025-10-23": 3,
    "2025-10-25": 2,
    "2025-10-28": 4,
    "2025-11-01": 2,
    "2025-11-02": 3,
    "2025-11-03": 5,
    "2025-11-04": 1,
    "2025-11-05": 2,
};

onMounted(async () => {
    await fetchUser();
    console.log("user", user);
});

const handleLogin = async () => {
    const {data} = await $axios.get('http://localhost:8000/api/inspire')
    console.log('inspire', data);
};

</script>

<template>
    <div
        class="flex flex-col justify-center gap-4 max-w-[80vw] mx-auto"
    >
        <StatisticsActivityGrid :data="sampleData" />
        <div class="flex justify-center gap-10 flex-wrap">
            <div>
                <div v-for="(value, key) in user" :key="key">
                    {{ key }}: {{ value }}
                </div>
            </div>
            <Timer />
            <TodoList />
        </div>
    </div>
    <UButton @click.prevent="handleLogin"> login </UButton>
</template>
