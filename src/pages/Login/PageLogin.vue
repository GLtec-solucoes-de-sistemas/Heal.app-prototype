<template>
  <div class="login-page">
    <div class="box-login">
      <img src="/images/Heal.app.svg" alt="imagem logo" />
      <h2>Acesse sua conta!</h2>
      <div class="block-inputs" v-for="field in fields" :key="field.name">
        <q-input
          v-for="(field, index) in fields.slice(0, 1)"
          :key="index"
          icon="mail"
          v-model="field.value"
          :type="field.name"
          :label="field.label"
          outlined
          class="q-mb-md"
          style="width: 100%; border: 1px solid white; border-radius: 8px; color: white"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fields = ref([
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Senha' }
]);
</script>


<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box-login {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  background: #202020;
  padding: 32px;
  border-radius: 12px;
}

.block-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

</style>
