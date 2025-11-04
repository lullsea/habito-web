<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const isRunning = ref(false);
const isPaused = ref(false);
const startTimestamp = ref<number | null>(null);
const pausedTimestamp = ref<number | null>(null);
let interval: NodeJS.Timer | null = null;

// Editable fields (before timer starts)
const hours = ref(0);
const minutes = ref(25);
const seconds = ref(0);

// Derived remaining time (in seconds)
const remaining = computed(
    () => hours.value * 3600 + minutes.value * 60 + seconds.value,
);

// Internal countdown value
const countdown = ref(remaining.value);

// --- Restore saved state
onMounted(() => {
    const savedStart = localStorage.getItem("timer_start");
    const savedCountdown = localStorage.getItem("timer_countdown");
    const savedRunning = localStorage.getItem("timer_running");
    const savedPaused = localStorage.getItem("timer_paused");

    if (savedCountdown) countdown.value = parseInt(savedCountdown);
    if (savedStart) startTimestamp.value = parseInt(savedStart);
    if (savedRunning === "true") resumeTimer();
    if (savedPaused) {
        pausedTimestamp.value = parseInt(savedPaused);
        pauseTimer();
    }
});

// --- Persist to localStorage
watch([countdown, isRunning, startTimestamp], () => {
    localStorage.setItem("timer_countdown", countdown.value.toString());
    localStorage.setItem("timer_running", isRunning.value.toString());
    if (startTimestamp.value)
        localStorage.setItem("timer_start", startTimestamp.value.toString());
});

// --- Computed display (HH:MM:SS)
const formattedTime = computed(() => {
    const h = Math.floor(countdown.value / 3600);
    const m = Math.floor((countdown.value % 3600) / 60);
    const s = countdown.value % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
});

// --- Timer logic
function startTimer() {
    if (isRunning.value) return;
    countdown.value = remaining.value;
    startTimestamp.value = Date.now();
    isRunning.value = true;
    interval = setInterval(updateTimer, 1000);
}

function endTimer() {
    // TODO: show a popup or something
    resetTimer();
}

function updateTimer() {
    if (!isRunning.value || !startTimestamp.value || !isPaused) return;
    const elapsed = Math.floor((Date.now() - startTimestamp.value) / 1000);
    const newRemaining = remaining.value - elapsed;
    if (newRemaining <= 0) {
        endTimer();
    } else {
        countdown.value = newRemaining;
    }
}

function pauseTimer() {
    if (!isRunning.value) return;
    clearInterval(interval);
    pausedTimestamp.value = Date.now();
    localStorage.setItem("timer_paused", pausedTimestamp.value.toString());
    isPaused.value = true;
}

function resumeTimer() {
    // if (isRunning.value) return;
    const savedStart = localStorage.getItem("timer_start");
    const savedPaused = localStorage.getItem("timer_paused");
    if (savedStart) {
        if (isPaused.value) {
            localStorage.removeItem("timer_paused");
            isPaused.value = false;
        }
        startTimestamp.value = parseInt(savedStart);
        pausedTimestamp.value = parseInt(savedPaused);
        if (savedPaused) {
            startTimestamp.value += Math.ceil(
                Date.now() - pausedTimestamp.value,
            );
            pausedTimestamp.value = null;
        }
        isRunning.value = true;
        interval = setInterval(updateTimer, 1000);
    }
}

function resetTimer() {
    clearInterval(interval!);
    isRunning.value = false;
    startTimestamp.value = null;
    countdown.value = remaining.value;
    localStorage.removeItem("timer_start");
    localStorage.removeItem("timer_countdown");
    localStorage.removeItem("timer_running");
    localStorage.removeItem("timer_paused");
}
</script>

<template>
    <UCard class="max-w-sm text-center mx-auto p-4">
        <h2 class="text-lg font-semibold mb-4">Timer</h2>

        <!-- Editable fields before start -->
        <div v-if="!isRunning" class="flex justify-center gap-2 mb-4">
            <UInputNumber
                v-model="hours"
                :min="0"
                :max="99"
                size="xl"
                placeholder="HH"
                :increment="false"
                :decrement="false"
                :ui="{ base: 'text-2xl text-center px-0' }"
                @blur="hours = hours || 0"
            />
            <span class="text-2xl px-0 mt-1">:</span>
            <UInputNumber
                v-model="minutes"
                :min="0"
                :max="59"
                size="xl"
                placeholder="MM"
                :increment="false"
                :decrement="false"
                :ui="{ base: 'text-2xl text-center px-0' }"
                @blur="minutes = minutes || 0"
            />
            <span class="text-lg">:</span>
            <UInputNumber
                v-model="seconds"
                :min="0"
                :max="59"
                size="xl"
                placeholder="SS"
                :increment="false"
                :decrement="false"
                :ui="{ base: 'text-2xl text-center px-0' }"
                @blur="seconds = seconds || 0"
            />
        </div>

        <!-- Running timer display -->
        <div v-else class="text-4xl font-mono mb-4">
            {{ formattedTime }}
        </div>

        <div class="flex justify-center gap-2">
            <UButton
                v-if="!isRunning"
                @click="startTimer"
                color="primary"
                icon="i-heroicons-play"
            >
                Start
            </UButton>
            <UButton
                v-else
                @click="() => (isPaused ? resumeTimer() : pauseTimer())"
                :icon="isPaused ? 'i-heroicons-play' : 'i-heroicons-pause'"
                color="neutral"
            >
                {{ isPaused ? "Resume" : "Pause" }}
            </UButton>
            <UButton
                v-if="isRunning"
                @click="resetTimer"
                color=""
                icon="i-heroicons-arrow-path"
            >
                Reset
            </UButton>
        </div>
    </UCard>
</template>
