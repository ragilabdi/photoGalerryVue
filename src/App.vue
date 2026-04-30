<script setup lang="ts">
import { ref } from 'vue'
import GalleryView from './components/GalleryView.vue'
import OrderForm from './components/OrderForm.vue'
import { selectedIds } from './store'

const currentPage = ref<'gallery' | 'order'>('gallery')
</script>

<template>
  <div id="app">
    <header>
      <div class="header-inner">
        <div class="logo">TL<span>CC.id</span></div>
        <div class="header-actions">
          <button 
            class="btn"
            :class="{ 'btn-gold': currentPage === 'gallery', 'btn-outline': currentPage !== 'gallery' }"
            @click="currentPage = 'gallery'"
          >
            📷 Galeri
          </button>
          <button 
            class="btn"
            :class="{ 'btn-gold': currentPage === 'order', 'btn-outline': currentPage !== 'order' }"
            @click="currentPage = 'order'"
            :disabled="selectedIds.length === 0"
          >
            🛒 Pesan Cetak
          </button>
        </div>
      </div>
    </header>
    
    <GalleryView v-if="currentPage === 'gallery'" />
    <OrderForm v-if="currentPage === 'order'" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
</style>
