<template>
  <div class="login-container">
    <div class="login-content">
      <div class="image-section">
        <div class="image-placeholder">
          <img src="/img/left.png" alt="QQM IT Solutions" class="login-image" />
        </div>
      </div>

      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="welcome-title">С Возвращением!</h2>
            <p class="welcome-title">Пожалуйста, вводите в Ваш аккаунт</p>
          </div>
          
          <v-form @submit.prevent="handleSubmit" class="login-form">
            <div v-if="step === 1">
              <div class="input-group">
                <label class="input-label">Номер телефона*</label>
                <v-text-field
                  v-model="phone"
                  placeholder="Ваш телефон"
                  variant="outlined"
                  class="custom-input"
                  hide-details="auto"
                  required
                />
              </div>
              
              <div class="input-group">
                <label class="input-label">Пароль*</label>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••••••"
                  variant="outlined"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="passwordRules"
                  class="custom-input"
                  hide-details="auto"
                  required
                />
              </div>
              
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="login-btn"
                :loading="loading"
              >
                Войти
              </v-btn>
            </div>

            <div v-if="step === 2">
              <div class="input-group">
                <label class="input-label">Код подтверждения*</label>
                <v-text-field
                  v-model="otp"
                  placeholder="Введите код"
                  variant="outlined"
                  class="custom-input"
                  hide-details="auto"
                  required
                  type="text"
                  maxlength="6"
                />
              </div>
              
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="login-btn"
                :loading="loading"
              >
                Подтвердить
              </v-btn>
              
              <p class="resend-link" @click="resendOTP">Не получили код? Отправить повторно</p>
            </div>
            
            <div class="remember-section" v-if="step === 1">
              <v-checkbox
                v-model="rememberMe"
                label="Запомнить меня"
                class="remember-checkbox"
              />
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const phone = ref('')
const password = ref('')
const otp = ref('')
const showPassword = ref(false)
const loading = ref(false)
const rememberMe = ref(false)
const step = ref(1) // 1: Login, 2: OTP

const passwordRules = [
  (v: string) => !!v || 'Пароль обязателен',
  (v: string) => v.length >= 6 || 'Пароль должен содержать минимум 6 символов',
]

const handleSubmit = async () => {
  loading.value = true

  try {
    if (step.value === 1) {
      const otpRequested = await authStore.login(phone.value, password.value) 
      if (otpRequested) {
        ElMessage({
          message: 'Код подтверждения отправлен на ваш номер.',
          type: 'success',
          duration: 5000,
          showClose: true,
        })
        step.value = 2
      } else {
        throw new Error('Неверные учетные данные.')
      }
    } else if (step.value === 2) {
      const success = await authStore.verifyCode(phone.value, otp.value)
      console.log(success)
      if (success) {
        ElMessage({
          message: 'Вы успешно вошли в систему!',
          type: 'success',
          duration: 5000,
          showClose: true,
        })
        router.push('/outgoing-calls')
      } else {
        throw new Error('Неверный код подтверждения.')
      }
    }
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Произошла ошибка'
    ElMessage({
      message: errorMsg,
      type: 'error',
      duration: 5000,
      showClose: true,
    })
  } finally {
    loading.value = false
  }
}

const resendOTP = async () => {
  loading.value = true
  try {
    await authStore.verifyCode(phone.value, password.value) // Resend using same credentials
    ElMessage({
      message: 'Код отправлен повторно.',
      type: 'info',
      duration: 5000,
      showClose: true,
    })
  } catch (error) {
    ElMessage({
      message: 'Ошибка при повторной отправке кода.',
      type: 'error',
      duration: 5000,
      showClose: true,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  padding: 20px;
}

.login-content {
  display: flex;
  width: 100%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.image-placeholder {
  position: absolute;
  padding: 10px 10px 10px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.login-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 72/82;
  border-radius: 40px;
}

.image-overlay {
  position: relative;
  z-index: 2;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: white;
  margin: 0;
}

.logo-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.2;
}

.overlay-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.overlay-title {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 1.2;
  margin: 0 0 8px 0;
  color: white;
}

.overlay-subtitle {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 1.2;
  margin: 0 0 24px 0;
  color: white;
}

.overlay-description {
  font-family: 'Mulish', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  max-width: 400px;
}

.stats {
  margin-top: auto;
}

.stats-text {
  font-family: 'Mulish', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: white;
}

.form-container {
  width: 100%;
  max-width: 510px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-title {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 25px;
  color: #212121;
  line-height: 1.5;
  text-align: start;
}

.welcome-subtitle {
  font-family: 'Mulish', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #6B7280;
}

:deep(.custom-input .v-field) {
  border-radius: 12px;
  font-family: 'Mulish', sans-serif;
}

:deep(.custom-input .v-field__input) {
  padding: 16px;
  font-size: 16px;
}

:deep(.custom-input .v-field__outline) {
  --v-field-border-opacity: 0.2;
}

:deep(.custom-input .v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  color: #4F7DF3;
}

.login-btn {
  height: 56px;
  border-radius: 12px;
  font-family: 'Mulish', sans-serif;
  font-weight: 600;
  font-size: 16px;
  text-transform: none;
  background: #4F7DF3;
  margin-top: 8px;
}

.login-btn:hover {
  background: #3d6ae6;
}

.remember-section {
  display: flex;
  align-items: center;
  margin-top: -8px;
}

:deep(.remember-checkbox .v-label) {
  font-family: 'Mulish', sans-serif;
  font-size: 14px;
  color: #666;
}

:deep(.remember-checkbox .v-selection-control__input) {
  color: #4F7DF3;
}
.resend-link {
  cursor: pointer;
  color: #4F7DF3;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.resend-link:hover {
  text-decoration: underline;
}
/* Responsive Design */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    height: auto;
    max-width: 400px;
  }
  
  .image-section {
    height: 300px;
  }
  
  .overlay-title,
  .overlay-subtitle {
    font-size: 24px;
  }
  
  .overlay-description {
    font-size: 14px;
  }
  
  .form-section {
    padding: 30px 20px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
}
</style>