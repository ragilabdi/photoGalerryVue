<script setup lang="ts">
import { computed, ref } from 'vue'
import { photos, selectedIds, selectedPhotos as selectedPhotosStore } from '../store'

interface Photo {
  id: number
  title: string
  filename: string
  description: string
  type: 'photo' | 'video'
}

const selectedFilter = ref<'all' | 'photo' | 'video'>('all')
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const selectedPhotos = computed(() => selectedPhotosStore.value)

const filteredPhotos = computed(() => {
  return photos.value.filter(photo => {
    const matchesFilter = selectedFilter.value === 'all' || photo.type === selectedFilter.value
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
})

const selectedCount = computed(() => selectedIds.value.length)
const allSelected = computed(() => {
  return filteredPhotos.value.length > 0 && filteredPhotos.value.every(photo => selectedIds.value.includes(photo.id))
})

const toggleSelect = (photo: Photo) => {
  const index = selectedIds.value.indexOf(photo.id)
  if (index !== -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(photo.id)
  }
}

const selectAllVisible = () => {
  selectedIds.value = filteredPhotos.value.map(photo => photo.id)
}

const clearSelection = () => {
  selectedIds.value = []
}

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const downloadSelected = async () => {
  if (selectedIds.value.length === 0) return

  for (const photo of selectedPhotos.value) {
    try {
      const response = await fetch(`/assets/${photo.filename}`)
      if (!response.ok) {
        throw new Error('Fetch failed')
      }
      const blob = await response.blob()
      downloadBlob(blob, photo.filename)
    } catch {
      const fallbackBlob = new Blob([
        `Photo: ${photo.title}\nFilename: ${photo.filename}\nDescription: ${photo.description}`
      ], { type: 'text/plain' })
      downloadBlob(fallbackBlob, `${photo.filename.replace(/\.[^/.]+$/, '')}-info.txt`)
    }
  }
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Abadikan Momen Terbaik</h1>
        <p>Galeri foto profesional dengan layanan cetak berkualitas tinggi</p>
        <div class="hero-badges">
          <span class="badge">📷 1000+ Foto</span>
          <span class="badge">🎬 Berkualitas HD</span>
          <span class="badge">⭐ 5 Bintang</span>
        </div>
      </div>
    </section>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            class="filter-tab"
            :class="{ active: selectedFilter === 'all' }"
            @click="selectedFilter = 'all'"
          >
            Semua
          </button>
          <button 
            class="filter-tab"
            :class="{ active: selectedFilter === 'photo' }"
            @click="selectedFilter = 'photo'"
          >
            📷 Foto
          </button>
          <button 
            class="filter-tab"
            :class="{ active: selectedFilter === 'video' }"
            @click="selectedFilter = 'video'"
          >
            🎬 Video
          </button>
        </div>

        <!-- Search Box -->
        <div class="search-box">
          <span>🔍</span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari foto..."
          />
        </div>
      </div>

      <!-- View Toggle -->
      <div class="view-toggle">
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          ⊞
        </button>
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- Selection Bar -->
    <div class="selection-bar" :class="{ active: selectedCount > 0 }">
      <div class="selection-info">
        <span><strong>{{ selectedCount }}</strong> foto terpilih</span>
        <span class="selection-count">{{ selectedCount }} dipilih</span>
      </div>
      <div class="selection-actions">
        <button
          class="btn btn-outline btn-sm"
          @click="selectAllVisible"
          :disabled="allSelected"
        >
          Select All
        </button>
        <button
          class="btn btn-outline btn-sm"
          @click="clearSelection"
        >
          Cancel
        </button>
        <button
          class="btn btn-gold btn-sm"
          @click="downloadSelected"
          :disabled="selectedCount === 0"
        >
          Download Selected
        </button>
      </div>
    </div>

    <!-- Gallery -->
    <div class="gallery-container">
      <div class="gallery-grid" :class="{ 'list-view': viewMode === 'list' }">
        <article
          v-for="photo in filteredPhotos"
          :key="photo.id"
          :class="['media-card', { selected: selectedIds.includes(photo.id) }]"
          @click="toggleSelect(photo)"
        >
          <div class="media-thumb-wrapper">
            <div class="thumb-placeholder">
              <span v-if="photo.type === 'photo'">📷</span>
              <span v-else>🎬</span>
              <span>{{ photo.type === 'photo' ? 'Photo' : 'Video' }}</span>
            </div>
            <span :class="['type-badge', photo.type]">{{ photo.type }}</span>
            <button class="card-checkbox" @click.stop="toggleSelect(photo)">
              <span v-if="selectedIds.includes(photo.id)">✓</span>
            </button>
          </div>

          <div class="card-body">
            <div class="card-title">{{ photo.title }}</div>
            <div class="card-meta">{{ photo.filename }}</div>
          </div>
        </article>
      </div>

      <div v-if="filteredPhotos.length === 0" class="empty-state">
        <p>📭 Tidak ada hasil pencarian</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 4rem;
}

.selection-bar {
  background: #111111;
  color: white;
  padding: 1rem 2rem;
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 18px;
  margin: 1.5rem 2rem 0;
}

.selection-bar.active {
  display: flex;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.selection-count {
  background: #f59e0b;
  color: #1c1917;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
}

.selection-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin: 2rem 2rem 0;
}

.gallery-grid.list-view {
  grid-template-columns: 1fr;
}

.media-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid rgba(28, 25, 23, 0.08);
  transition: all 0.25s;
  cursor: pointer;
  position: relative;
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(28, 25, 23, 0.16);
}

.media-card.selected {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
}

.media-thumb-wrapper {
  position: relative;
  overflow: hidden;
}

.thumb-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #9ca3af;
  gap: 0.5rem;
  font-size: 2.5rem;
}

.thumb-placeholder span {
  font-size: 0.8rem;
  font-weight: 500;
}

.type-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.type-badge.photo {
  background: #fef3c7;
  color: #78350f;
}

.type-badge.video {
  background: #fce7f3;
  color: #be185d;
}

.card-checkbox {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: transparent;
  transition: all 0.2s;
}

.media-card:hover .card-checkbox,
.media-card.selected .card-checkbox {
  background: rgba(255, 255, 255, 0.95);
  border-color: #f59e0b;
}

.media-card.selected .card-checkbox {
  background: #f59e0b;
  color: white;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1c1917;
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  font-size: 0.78rem;
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
}

.btn-sm {
  padding: 0.45rem 1rem;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .selection-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .selection-actions {
    justify-content: flex-start;
  }
}
</style>
