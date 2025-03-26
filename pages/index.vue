<script setup>
import { ref, onMounted } from 'vue';
import { useState } from '#imports';

const flightData = useState('flightData', () => null);
const currentIndex = ref(0);
const uavStyle = ref({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(0deg)'
});
const initialPosition = { top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(0deg)' };

let interval = null;
const isFlying = ref(false);
async function fetchFlightData() {
    try {
        const data = await $fetch('/api/flight');
        flightData.value = data.data;
        console.log(flightData.value.length);
        console.log(data);
        console.log(data.data);


    } catch (error) {
        console.error(error);
    }
}

function startFlight() {
    if (!flightData.value.length || isFlying.value) return;
    isFlying.value = true;
    currentIndex.value = 0;

    interval = setInterval(() => {
        if (currentIndex.value >= flightData.value.length) {
            stopFlight();
            return;
        }
        let { speed, direction } = flightData.value[currentIndex.value];
        moveUAV(speed, direction);
        currentIndex.value++;
    }, 1000);
    setTimeout(() => {
        stopFlight();
    }, 20000);
}

function stopFlight() {
    clearInterval(interval);
    isFlying.value = false;
    uavStyle.value = {
        ...initialPosition,
        transition: 'none'
    };
}

function moveUAV(speed, direction) {

    const speedPixelsPerSec = (speed / 100) * 0.3;
    let offsetX = Math.cos(direction * (Math.PI / 180)) * speedPixelsPerSec;
    let offsetY = Math.sin(direction * (Math.PI / 180)) * speedPixelsPerSec;

    let currentX = parseFloat(uavStyle.value.left) + offsetX;
    let currentY = parseFloat(uavStyle.value.top) + offsetY;


    uavStyle.value = {
        top: `${currentY}%`,
        left: `${currentX}%`,
        transform: `translate(-50%, -50%) rotate(${Number(direction) + 90}deg)`,
        transition: `2s linear`

    };
}

onMounted(fetchFlightData);
</script>

<template>
    <div class="container">
        <div class="map-container">
            <img src="/assets/img/google-map.png" alt="Map" class="map">
            <img src="/assets/icons/UAV.png" alt="UAV" class="uav position-absolute" :style="uavStyle">
            <div class="coord position-absolute north">N 360°</div>
            <div class="coord position-absolute south">N 180°</div>
            <div class="coord position-absolute west">W 270°</div>
            <div class="coord position-absolute east">E 90°</div>
            <button class="start-btn btn-main position-absolute" v-if="!isFlying" @click="startFlight">ПОЧАТИ</button>
            <button class="stop-btn btn-main position-absolute" v-if="isFlying" @click="stopFlight">СТОП</button>
        </div>
    </div>
</template>

<style>
.map-container {
    position: relative;
    width: 1200px;
    height: 800px;
    border-radius: 15px;
    overflow: hidden;
}

.map {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.uav {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: auto;
}

.coord {
    font-size: 16px;
    font-weight: bold;
    color: white;
}

.north {
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
}

.south {
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
}

.west {
    left: 5px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
}

.east {
    right: 5px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
}
</style>
