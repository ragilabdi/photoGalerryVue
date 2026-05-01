<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="support-card">
      <div class="support-panel">

        <div class="support-header">
          <div>
            <h1>💝 Beri Tips via Saweria</h1>
            <p>Apresiasi untuk kreator galeri ini</p>
          </div>
          <button class="modal-close" type="button" @click="closeModal">✕</button>
        </div>

        <div class="tips-heart-banner">
          <div class="heart-icon">🙏</div>
          <p>
            <strong>Terima kasih sudah menggunakan layanan kami!</strong>
            Tips Anda sangat berarti. Tidak ada jumlah minimum — semua sangat dihargai.
          </p>
        </div>

        <div style="text-align:center;margin-bottom:1.25rem;">
          <div style="display:inline-flex;align-items:center;gap:0.6rem;background:#1f1f2e;color:white;padding:0.5rem 1.25rem;border-radius:30px;font-size:0.85rem;font-weight:600;letter-spacing:0.02em;">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="#F5487F"/><path d="M11 14c0-1.657 1.343-3 3-3h8c1.657 0 3 1.343 3 3v1c0 .552-.448 1-1 1H12c-.552 0-1-.448-1-1v-1zM11 20h14v2c0 1.657-1.343 3-3 3h-8c-1.657 0-3-1.343-3-3v-2z" fill="white"/></svg>
            Saweria — Platform Tips Terpercaya
          </div>
          <p style="font-size:0.75rem;color:#9CA3AF;margin-top:0.5rem;">Pembayaran aman · GoPay, OVO, DANA, QRIS, Transfer Bank</p>
        </div>

        <p style="font-size:0.82rem;font-weight:500;color:var(--charcoal);margin-bottom:0.6rem;">Pilih nominal tips:</p>
        <div class="tips-amount-grid" style="margin-bottom:0.75rem;">
          <button
            v-for="amount in amounts"
            :key="amount"
            type="button"
            class="tips-amount-btn"
            :class="{ selected: selectedAmount === amount }"
            @click="selectAmount(amount)"
          >
            Rp {{ format(amount) }}
          </button>
        </div>

        <div style="display:flex;gap:0.5rem;margin-bottom:1.25rem;align-items:center;">
          <div style="position:relative;flex:1;">
            <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);font-size:0.8rem;color:#9CA3AF;pointer-events:none;">Rp</span>
            <input
              type="number"
              class="tips-custom-input"
              placeholder="Nominal lain..."
              style="padding-left:2rem;margin-bottom:0;"
              v-model="customAmount"
            />
          </div>
        </div>

        <div class="qris-box" style="background:linear-gradient(135deg,#1f1f2e,#2d1b3d);border-radius:16px;padding:1.5rem;text-align:center;margin-bottom:1rem;">
          <div style="color:rgba(255,255,255,0.6);font-size:0.78rem;margin-bottom:0.4rem;">Total tips yang akan dikirim</div>
          <div style="font-size:2rem;font-weight:700;color:#F5487F;margin-bottom:1.25rem;">
            Rp {{ format(finalAmount ?? 10000) }}
          </div>

          <a
            :href="saweriaLink"
            target="_blank"
            class="support-button primary"
            style="width:100%;display:inline-flex;align-items:center;justify-content:center;gap:0.6rem;"
          >
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="white" fill-opacity="0.2"/><path d="M11 14c0-1.657 1.343-3 3-3h8c1.657 0 3 1.343 3 3v1c0 .552-.448 1-1 1H12c-.552 0-1-.448-1-1v-1zM11 20h14v2c0 1.657-1.343 3-3 3h-8c-1.657 0-3-1.343-3-3v-2z" fill="white"/></svg>
            Kirim Tips Sekarang via Saweria
          </a>

          <div style="margin-top:0.85rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;flex-wrap:wrap;">
            <span style="font-size:0.68rem;color:rgba(255,255,255,0.4);">Pembayaran via</span>
            <span style="font-size:0.68rem;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.08);padding:0.15rem 0.5rem;border-radius:4px;">GoPay</span>
            <span style="font-size:0.68rem;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.08);padding:0.15rem 0.5rem;border-radius:4px;">OVO</span>
            <span style="font-size:0.68rem;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.08);padding:0.15rem 0.5rem;border-radius:4px;">DANA</span>
            <span style="font-size:0.68rem;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.08);padding:0.15rem 0.5rem;border-radius:4px;">QRIS</span>
            <span style="font-size:0.68rem;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.08);padding:0.15rem 0.5rem;border-radius:4px;">Transfer Bank</span>
          </div>
        </div>

        <div id="saweriaSetupNotice" style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:10px;padding:0.85rem 1rem;font-size:0.8rem;color:#92400E;line-height:1.6;display:none;">
          <strong>⚙️ Belum dikonfigurasi:</strong> Masukkan username Saweria Anda di <strong>Pengaturan</strong> agar tombol di atas aktif.<br>
          Belum punya akun? Daftar gratis di <a href="https://saweria.co" target="_blank" style="color:#D97706;font-weight:600;">saweria.co</a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])
const closeModal = () => emit('close')

const amounts = [10000, 25000, 50000]

const selectedAmount = ref<number | null>(null)
const customAmount = ref('')

// Ganti dengan link Saweria kamu
const saweriaBaseUrl = 'https://saweria.co/supportTL'

const selectAmount = (amount: number) => {
  selectedAmount.value = amount
  customAmount.value = amount.toString()
}

// Format Rupiah
const format = (num: number | string) => {
  return new Intl.NumberFormat('id-ID').format(Number(num))
}

// Nominal aktif (prioritas: custom > quick)
const finalAmount = computed(() => {
  return customAmount.value ? Number(customAmount.value) : selectedAmount.value
})

// Link tetap ke Saweria (karena tidak support param amount)
const saweriaLink = computed(() => {
  return saweriaBaseUrl
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-50 {
  background: var(--cream);
}
.text-center {
  text-align: center;
}
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
.support-card {
  width: 100%;
  max-width: 520px;
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.support-panel {
  padding: 2rem;
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
.support-header {
  margin-bottom: 1.5rem;
}
.support-header h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  color: var(--charcoal);
}
.support-header p {
  margin-top: 0.5rem;
  color: #6B7280;
}
.tips-amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.tips-amount-btn {
  padding: 0.65rem 0.5rem;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--charcoal);
  transition: all 0.2s;
  text-align: center;
}
.tips-amount-btn:hover {
  border-color: #f43f5e;
  background: #fff1f2;
  color: #f43f5e;
}
.tips-amount-btn.selected {
  border-color: #f43f5e;
  background: #fff1f2;
  color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244,63,94,0.12);
}
.tips-heart-banner {
  background: linear-gradient(135deg, #fff1f2, #fce7f3);
  border: 1px solid rgba(244,63,94,0.2);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.tips-heart-banner .heart-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}
.tips-heart-banner p {
  font-size: 0.82rem;
  color: #9F1239;
  line-height: 1.5;
  margin: 0;
}
.tips-heart-banner strong {
  display: block;
  font-size: 0.88rem;
  margin-bottom: 0.15rem;
}
.tips-custom-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: var(--charcoal);
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 0.75rem;
}
.tips-custom-input:focus {
  border-color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244,63,94,0.1);
}
.support-input,
.support-textarea {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 18px;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: var(--charcoal);
  background: white;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-bottom: 1rem;
}
.support-input:focus,
.support-textarea:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}
.support-textarea {
  min-height: 120px;
  resize: vertical;
}
.support-cta {
  display: block;
  width: 100%;
  text-align: center;
  padding: 1rem 1.15rem;
  border-radius: 18px;
  background: var(--rose);
  color: white;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}
.support-cta:hover {
  background: #be165d;
}
.support-button {
  display: block;
  width: 100%;
  padding: 1rem 1.15rem;
  border: 1.5px solid transparent;
  border-radius: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.support-button.primary {
  background: var(--rose);
  color: white;
}
.support-button.primary:hover {
  background: #be165d;
}
.support-button.secondary {
  background: transparent;
  border-color: var(--border);
  color: var(--charcoal);
}
.support-button.secondary:hover {
  background: rgba(28,25,23,0.04);
}
@media (max-width: 640px) {
  .amount-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 480px) {
  .amount-grid {
    grid-template-columns: 1fr;
  }
}
</style>
