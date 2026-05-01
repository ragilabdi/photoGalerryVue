<script setup lang="ts">
import { ref } from 'vue'
import GalleryView from './components/GalleryView.vue'
import OrderForm from './components/OrderForm.vue'
import SupportView from './components/SupportView.vue'
import { selectedIds } from './store'

const currentPage = ref<'gallery' | 'order' | 'support'>('gallery')
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
          <button 
            class="btn"
            :class="{ 'btn-gold': currentPage === 'support', 'btn-outline': currentPage !== 'support' }"
            @click="currentPage = 'support'"
          >
            💖 Dukung
          </button>
        </div>
      </div>
    </header>
    
    <GalleryView />
    <OrderForm v-if="currentPage === 'order'" @close="currentPage = 'gallery'" />
    <SupportView v-if="currentPage === 'support'" @close="currentPage = 'gallery'" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
</style>
