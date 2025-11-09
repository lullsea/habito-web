<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const isRunning = ref(false);
const isPaused = ref(false);
const startTimestamp = ref<number | null>(null);
const pausedTimestamp = ref<number | null>(null);

let interval: NodeJS.Timer | null = null;

// Editable fields (before timer starts)
const minutes = ref(30);
const seconds = ref(0);

// Derived remaining time (in seconds)
const remaining = computed(() => minutes.value * 60 + seconds.value);

// Internal countdown value
const countdown = ref(remaining.value);

const radius = 92;
const circumference = 2 * Math.PI * radius;

const progressOffset = computed(() => {
    const progress = countdown.value != 0 ? countdown.value / (minutes.value * 60 + seconds.value) : 1;
    return circumference * (1 - progress);
});

// --- Restore saved state
onMounted(() => {
    const savedStart = localStorage.getItem("timer_start");
    const savedCountdown = localStorage.getItem("timer_countdown");
    const savedRunning = localStorage.getItem("timer_running");
    const savedPaused = localStorage.getItem("timer_paused");
    const savedMinutes = localStorage.getItem("timer_minutes");
    const savedSeconds = localStorage.getItem("timer_seconds");

    if (savedCountdown) countdown.value = parseInt(savedCountdown);
    if (savedStart) {
        startTimestamp.value = parseInt(savedStart);
        if (savedMinutes) minutes.value = parseInt(savedMinutes);
        if (savedSeconds) seconds.value = parseInt(savedSeconds);
        if (savedRunning === "true") resumeTimer();
        if (savedPaused) {
            pausedTimestamp.value = parseInt(savedPaused);
            pauseTimer();
        }
    }
});

// --- Persist to localStorage
watch([countdown, isRunning, startTimestamp, minutes, seconds], () => {
    localStorage.setItem("timer_countdown", countdown.value.toString());
    localStorage.setItem("timer_running", isRunning.value.toString());
    localStorage.setItem("timer_minutes", minutes.value.toString());
    localStorage.setItem("timer_seconds", seconds.value.toString());
    if (startTimestamp.value)
        localStorage.setItem("timer_start", startTimestamp.value.toString());
});

// --- Computed display (HH:MM:SS)
const formattedTime = computed(() => {
    const m = Math.floor(countdown.value / 60);
    const s = countdown.value % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
    countdown.value = 0;
    remaining.value = 0;
    localStorage.removeItem("timer_start");
    localStorage.removeItem("timer_countdown");
    localStorage.removeItem("timer_running");
    localStorage.removeItem("timer_paused");
}
</script>

<template>
    <UCard class="relative w-100 h-fit">
        <h2 class="text-lg font-semibold">Timer</h2>

        <!-- Editable fields before start -->
        <svg
            class="absolute top-4 left-11 overflow-visible w-max h-fit -rotate-90"
        >
            <circle
                class="text-neutral-200"
                stroke="currentColor"
                stroke-width="8"
                fill="transparent"
                :r="radius"
                cx="80"
                cy="80"
            />
            <circle
                class="text-secondary-500 transition-all duration-300 ease-linear"
                stroke="currentColor"
                stroke-width="8"
                stroke-linecap="round"
                fill="transparent"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                :r="radius"
                cx="80"
                cy="80"
            />
        </svg>

        <div class="mt-21 my-19 h-16">
            <div v-if="!isRunning" class="flex justify-center gap-2 mb-4">
                <UInputNumber
                    v-model="minutes"
                    variant="ghost"
                    :min="0"
                    :max="120"
                    size="xl"
                    placeholder="MM"
                    :increment="false"
                    :decrement="false"
                    :ui="{ base: 'text-3xl text-center px-0 max-w-16' }"
                    @blur="minutes = minutes || 0"
                />
                <span class="text-2xl mt-1">:</span>
                <UInputNumber
                    v-model="seconds"
                    variant="ghost"
                    :min="0"
                    :max="59"
                    size="xl"
                    placeholder="SS"
                    :increment="false"
                    :decrement="false"
                    :ui="{ base: 'text-3xl text-center px-0 max-w-16' }"
                    @blur="seconds = seconds || 0"
                />
            </div>

            <!-- Running timer display -->
            <div v-else class="text-center text-4xl font-mono pt-2">
                {{ formattedTime }}
            </div>
        </div>

        <div class="flex justify-center gap-2">
            <UButton
                size="xl"
                v-if="!isRunning"
                @click="startTimer"
                color="primary"
                icon="i-heroicons-play"
            >
                Start
            </UButton>
            <UButton
                size="xl"
                v-else
                @click="() => (isPaused ? resumeTimer() : pauseTimer())"
                :icon="isPaused ? 'i-heroicons-play' : 'i-heroicons-pause'"
                color="neutral"
            >
                {{ isPaused ? "Resume" : "Pause" }}
            </UButton>
            <UButton
                size="xl"
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
