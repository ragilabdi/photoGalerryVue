import { computed, ref } from 'vue'

export interface Photo {
  id: number
  title: string
  filename: string
  description: string
  type: 'photo' | 'video'
}

export const photos = ref<Photo[]>([
  {
    id: 1,
    title: 'Mountain Landscape',
    filename: 'mountain.jpg',
    description: 'Beautiful mountain landscape at sunset',
    type: 'photo'
  },
  {
    id: 2,
    title: 'Ocean View',
    filename: 'ocean.jpg',
    description: 'Serene ocean view with golden hour lighting',
    type: 'photo'
  },
  {
    id: 3,
    title: 'Forest Trail',
    filename: 'forest.jpg',
    description: 'Peaceful forest trail surrounded by trees',
    type: 'photo'
  },
  {
    id: 4,
    title: 'City Lights',
    filename: 'city.jpg',
    description: 'Urban landscape with city lights at night',
    type: 'photo'
  },
  {
    id: 5,
    title: 'Sunset Time-lapse',
    filename: 'sunset.mp4',
    description: 'Beautiful sunset time-lapse video',
    type: 'video'
  },
  {
    id: 6,
    title: 'Beach Waves',
    filename: 'waves.jpg',
    description: 'Crashing waves on a sandy beach',
    type: 'photo'
  }
])

export const selectedIds = ref<number[]>([])
export const selectedPhotos = computed(() => {
  return photos.value.filter(photo => selectedIds.value.includes(photo.id))
})
export const selectedCount = computed(() => selectedIds.value.length)
