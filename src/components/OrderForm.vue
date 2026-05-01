<script setup lang="ts">
import { computed, ref } from 'vue'
import { selectedIds, selectedPhotos as selectedPhotosStore } from '../store'

const emit = defineEmits(['close'])

const closeModal = () => emit('close')

interface ProductOption {
  id: string
  title: string
  subtitle: string
  price: number
  icon: string
}

interface BankOption {
  id: string
  name: string
  account: string
  badge: string
  color: string
}

const currentStep = ref(1)
const orderPlaced = ref(false)

const selectedPhotos = selectedPhotosStore

const productOptions = ref<ProductOption[]>([
  { id: '4R', title: '4R Print', subtitle: '10 x 15 cm', price: 4500, icon: '🖼️' },
  { id: '5R', title: '5R Print', subtitle: '13 x 18 cm', price: 6500, icon: '🖼️' },
  { id: '8R', title: '8R Print', subtitle: '20 x 25 cm', price: 12000, icon: '🖼️' },
  { id: 'canvas', title: 'Canvas', subtitle: 'Premium finish', price: 85000, icon: '🖼️' },
  { id: 'frame', title: 'Framed Print', subtitle: 'With wooden frame', price: 95000, icon: '🖼️' },
  { id: 'album', title: 'Photo Album', subtitle: '20 pages', price: 175000, icon: '📚' },
  { id: 'mug', title: 'Photo Mug', subtitle: 'Ceramic mug', price: 65000, icon: '☕' },
  { id: 'poster', title: 'Poster', subtitle: 'A3 size', price: 38000, icon: '📰' }
])

const bankOptions = ref<BankOption[]>([
  { id: 'BCA', name: 'Bank BCA', account: '1234567890', badge: 'BCA', color: '#005BAC' },
  { id: 'Mandiri', name: 'Bank Mandiri', account: '0987654321', badge: 'MANDIRI', color: '#003D7A' },
  { id: 'BRI', name: 'Bank BRI', account: '1122334455', badge: 'BRI', color: '#00529B' }
])

const selectedProduct = ref<ProductOption | null>(null)
const selectedBank = ref<BankOption | null>(null)

const shippingInfo = ref({
  name: '',
  whatsapp: '',
  address: '',
  city: '',
  postal: '',
  note: ''
})

const steps = ['Photo Review', 'Select Product', 'Shipping Information', 'Payment']
const shippingCost = 20000

const photoCount = computed(() => selectedPhotos.value.length)
const unitPrice = computed(() => selectedProduct.value?.price ?? 0)
const totalPrice = computed(() => photoCount.value * unitPrice.value + shippingCost)
const selectedProductLabel = computed(() => selectedProduct.value ? selectedProduct.value.title : '-')

const canContinue = computed(() => {
  if (currentStep.value === 1) return photoCount.value > 0
  if (currentStep.value === 2) return selectedProduct.value !== null
  if (currentStep.value === 3) {
    return (
      shippingInfo.value.name.trim() &&
      shippingInfo.value.whatsapp.trim() &&
      shippingInfo.value.address.trim()
    )
  }
  if (currentStep.value === 4) return selectedBank.value !== null
  return false
})

const selectProduct = (product: ProductOption) => {
  selectedProduct.value = product
}

const selectBank = (bank: BankOption) => {
  selectedBank.value = bank
}

const goBack = () => {
  if (currentStep.value > 1) currentStep.value -= 1
}

const goNext = () => {
  if (currentStep.value < 4) {
    currentStep.value += 1
  } else {
    orderPlaced.value = true
    selectedIds.value = []
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="order-container">
      <div class="modal-header">
        <div>
          <h2>Photo Printing</h2>
          <p class="order-subtitle">Empat langkah mudah untuk cetak foto dengan produk pilihan.</p>
        </div>
        <button class="modal-close" type="button" @click="closeModal">✕</button>
      </div>

    <div class="order-steps">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="step-indicator"
        :class="{
          active: currentStep === index + 1,
          done: currentStep > index + 1
        }"
      >
        <span class="step-num">{{ index + 1 }}</span>
        {{ step }}
      </div>
    </div>

    <div class="order-section" v-show="currentStep === 1">
      <h3>Foto yang akan dicetak</h3>
      <div class="selected-preview">
        <div class="preview-thumb" v-for="photo in selectedPhotos" :key="photo.id">
          <span v-if="photo.type === 'photo'">📷</span>
          <span v-else>🎬</span>
        </div>
      </div>
      <p class="step-note">{{ photoCount }} foto terpilih untuk dicetak.</p>
      <div class="info-box">
        💡 Pastikan semua foto yang ingin dicetak sudah terpilih. Kembali ke galeri untuk menambah atau mengurangi pilihan.
      </div>
    </div>

    <div class="order-section" v-show="currentStep === 2">
      <p class="step-note">Pilih produk cetak yang diinginkan:</p>
      <div class="product-grid">
        <div
          v-for="product in productOptions"
          :key="product.id"
          class="product-card"
          :class="{ selected: selectedProduct?.id === product.id }"
          @click="selectProduct(product)"
        >
          <div class="product-icon">{{ product.icon }}</div>
          <div class="product-name">{{ product.title }}</div>
          <div class="product-size">{{ product.subtitle }}</div>
          <div class="product-price">Rp {{ product.price.toLocaleString('id-ID') }}</div>
        </div>
      </div>
      <div v-if="currentStep === 2 && !selectedProduct" class="error-text">
        ⚠️ Pilih salah satu produk terlebih dahulu.
      </div>
    </div>

    <div class="order-section" v-show="currentStep === 3">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nama Lengkap <span>*</span></label>
          <input
            class="form-input"
            type="text"
            v-model="shippingInfo.name"
            placeholder="Budi Santoso"
          />
        </div>
        <div class="form-group">
          <label class="form-label">No. WhatsApp <span>*</span></label>
          <input
            class="form-input"
            type="text"
            v-model="shippingInfo.whatsapp"
            placeholder="08xxxxxxxxxx"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Alamat Lengkap <span>*</span></label>
        <textarea
          class="form-textarea"
          v-model="shippingInfo.address"
          placeholder="Jl. Contoh No. 123, RT 01/RW 02, Kelurahan, Kecamatan, Kota..."
        ></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Kota</label>
          <input
            class="form-input"
            type="text"
            v-model="shippingInfo.city"
            placeholder="Balikpapan"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Kode Pos</label>
          <input
            class="form-input"
            type="text"
            v-model="shippingInfo.postal"
            placeholder="76112"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Catatan (opsional)</label>
        <input
          class="form-input"
          type="text"
          v-model="shippingInfo.note"
          placeholder="Misal: tolong cetak dengan finishing glossy"
        />
      </div>
      <div v-if="currentStep === 3 && !canContinue" class="error-text">
        ⚠️ Harap isi nama, WhatsApp, dan alamat lengkap.
      </div>
    </div>

    <div class="order-section" v-show="currentStep === 4">
      <p class="step-note">Pilih bank tujuan transfer:</p>
      <div class="payment-grid">
        <div
          v-for="bank in bankOptions"
          :key="bank.id"
          class="payment-card"
          :class="{ selected: selectedBank?.id === bank.id }"
          @click="selectBank(bank)"
        >
          <div class="bank-logo" :style="{ background: bank.color, color: '#fff' }">{{ bank.badge }}</div>
          <div class="payment-info">
            <h4>{{ bank.name }}</h4>
            <p>No. Rek: <span class="account-number">{{ bank.account }}</span></p>
          </div>
        </div>
      </div>
      <div v-if="currentStep === 4 && !selectedBank" class="error-text">
        ⚠️ Pilih bank tujuan terlebih dahulu.
      </div>

      <div class="payment-summary">
        <div class="summary-row"><span>Foto dicetak</span><span>{{ photoCount }}</span></div>
        <div class="summary-row"><span>Produk</span><span>{{ selectedProductLabel }}</span></div>
        <div class="summary-row"><span>Harga satuan</span><span>Rp {{ unitPrice.toLocaleString('id-ID') }}</span></div>
        <div class="summary-row"><span>Biaya pengiriman</span><span>Rp {{ shippingCost.toLocaleString('id-ID') }}</span></div>
        <div class="summary-row total"><span>Total Pembayaran</span><span>Rp {{ totalPrice.toLocaleString('id-ID') }}</span></div>
      </div>

      <div class="info-box" style="margin-top:1rem;">
        <strong>📋 Cara Pembayaran:</strong><br />
        1. Transfer ke salah satu rekening di atas<br />
        2. Simpan bukti transfer<br />
        3. Kirim bukti ke WhatsApp admin setelah submit<br />
        4. Pesanan diproses setelah pembayaran dikonfirmasi
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-outline" type="button" @click="goBack" v-if="currentStep > 1">← Kembali</button>
      <button class="btn btn-gold" type="button" :disabled="!canContinue" @click="goNext">
        {{ currentStep < 4 ? 'Lanjutkan →' : 'Bayar Sekarang' }}
      </button>
    </div>

    <div class="success-view" v-if="orderPlaced">
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h3>Pesanan Berhasil!</h3>
        <p>Pesanan cetak foto Anda telah diterima. Silakan lakukan transfer pembayaran dan kirimkan bukti ke WhatsApp admin kami.</p>
        <div class="order-id">ORD-{{ Date.now().toString().slice(-6) }}</div>
        <div class="success-actions">
          <button class="btn btn-sage" type="button">💬 Kirim ke WhatsApp</button>
          <button class="btn btn-outline" type="button" @click="orderPlaced = false">Kembali</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba(28,25,23,0.55);
    backdrop-filter: blur(2px);
  }

  .order-container {
    width: 100%;
    max-width: 860px;
    margin: 0;
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 28px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 2rem 0;
}

.modal-close {
  border: none;
  background: rgba(28,25,23,0.04);
  color: var(--charcoal);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(28,25,23,0.12);
}

.order-header {
  padding: 2rem 2rem 0;
}

.order-header h2 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--charcoal);
}

.order-subtitle {
  margin-top: 0.5rem;
  color: #6B7280;
}

.order-steps {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
}

.step-indicator {
  flex: 1;
  padding: 1rem 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: #9CA3AF;
  border-bottom: 2px solid transparent;
}

.step-indicator.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

.step-indicator.done {
  color: var(--sage);
  border-bottom-color: var(--sage);
}

.step-num {
  display: inline-flex;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: currentColor;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  margin-right: 0.4rem;
}

.order-section {
  padding: 1.5rem 2rem;
}

.selected-preview {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1rem 0;
  max-height: 140px;
  overflow-y: auto;
}

.preview-thumb {
  width: 84px;
  height: 84px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  border: 2px solid var(--gold);
  font-size: 2rem;
}

.step-note {
  margin: 0.5rem 0 1rem;
  color: #6B7280;
}

.info-box {
  background: var(--gold-light);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-size: 0.9rem;
  color: var(--brown);
  line-height: 1.7;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.9rem;
}

.product-card {
  border: 1.5px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  text-align: center;
}

.product-card:hover {
  border-color: var(--gold);
  background: var(--gold-light);
}

.product-card.selected {
  border-color: var(--gold);
  background: var(--gold-light);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.product-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.product-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--charcoal);
  margin-bottom: 0.35rem;
}

.product-size {
  font-size: 0.78rem;
  color: #6B7280;
  margin-bottom: 0.75rem;
}

.product-price {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--gold);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--charcoal);
  margin-bottom: 0.45rem;
}

.form-label span {
  color: var(--rose);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: var(--charcoal);
  background: white;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-grid {
  display: grid;
  gap: 0.75rem;
}

.payment-card {
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-card:hover {
  border-color: var(--gold);
}

.payment-card.selected {
  border-color: var(--gold);
  background: var(--gold-light);
}

.bank-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
  flex-shrink: 0;
}

.payment-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.payment-info p {
  font-size: 0.85rem;
  color: #6B7280;
}

.payment-summary {
  background: var(--cream);
  border-radius: 16px;
  padding: 1.25rem;
  margin-top: 1.25rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #6B7280;
  padding: 0.35rem 0;
}

.summary-row.total {
  font-weight: 700;
  color: var(--charcoal);
  border-top: 1px solid var(--border);
  margin-top: 0.75rem;
  padding-top: 0.75rem;
}

.account-number {
  font-family: monospace;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--charcoal);
}

.modal-footer {
  padding: 1.5rem 2rem 2rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  border-top: 1px solid var(--border);
}

.error-text {
  color: #e24b4a;
  font-size: 0.88rem;
  margin-top: 0.75rem;
}

.success-view {
  padding: 2rem;
  text-align: center;
}

.success-card {
  background: var(--warm-white);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem;
  box-shadow: 0 16px 40px rgba(28, 25, 23, 0.08);
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--sage);
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.success-card h3 {
  margin-bottom: 0.75rem;
}

.order-id {
  margin: 1rem 0;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: white;
  font-family: monospace;
  font-weight: 700;
}

.success-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 840px) {
  .form-row,
  .order-steps {
    display: flex;
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 620px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
