<template>
  <Header />
  <transition
    name="fade"
    mode="out-in">
    <router-view></router-view>
  </transition>
  <Loader v-if="store.isLoading" />
  <TextTyper
    :text="[
      `
    -- Взлом доступа --
    setAccessLevel('admin')
    runHackingScript('mainframe.exe')
    getPassword()
    encryptMessage('Access granted')

    -- Инициализация --
    loadModule('hackUtils')
    connectController('hackController')
    activateBruteforce()
    ---------10%
    ---------30%
    ---------50%
    ---------70%
    ---------90%
    ---------100%

  -- Скрытие следов --
    deleteLogs()
    overwriteEventLog()
    enableStealthMode()
    wipeFingerprints()

  -- Проверка безопасности --
    scanNetwork()
    detectVulnerabilities()
    testSecurity()

  -- Включение фаервола --
    activateFirewall('firewall.exe')
    launchDDoSAttack('enemyServer.com')
    runAntivirus()
    hackTrojan('backdoor.exe')

  -- Завершение операции --
    exitWithoutTraces()
    removeHackerSlot()....`,
    ]" />
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Loader from '@/components/Loader.vue';
import { useAuthStore } from './store/auth_store';
import { onMounted } from 'vue';
import TextTyper from '@/components/assetsComponent/TextTyper.vue';

const store = useAuthStore();

onMounted(() => {
  if (!store.isAuth) {
    store.auth();
  }
});
</script>
<style lang="scss">
* {
  font-family: monospace, sans-serif;
  color: #0f0;
}
body {
  margin: 0;
  padding: 0;
  background-color: #090909;
}
#app {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
