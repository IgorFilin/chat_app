<template>
  <Header />
  <transition
    name="fade"
    mode="out-in">
    <router-view></router-view>
  </transition>
  <Loader v-if="store.isLoading" />
  <TextTyper
    v-if="!store.isAuth"
    :text="mainPageCodeText" />
  <audio
    v-if="!store.isAuth"
    autoplay
    loop
    ref="audio"
    src="./sound/hack.mp3"></audio>
  <Icon
    v-if="!store.isAuth"
    @click="settingVolume"
    class="v-icon_sound"
    :id="isVolume ? 'sound_on' : 'sound_off'"
    color="orange" />
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue';
import Loader from '@/components/Loader.vue';
import { useAuthStore } from './store/auth_store';
import { onMounted, ref } from 'vue';
import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import Icon from '@/components/assetsComponent/Icon.vue';

const store = useAuthStore();

const audio = ref();

const isVolume = ref(true);

function settingVolume() {
  audio.value.volume = audio.value.volume ? 0 : 1;
  isVolume.value = !isVolume.value;
}

onMounted(() => {
  if (!store.isAuth) {
    store.auth();
  }
});

const mainPageCodeText = [
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
];
</script>
<style lang="scss">
* {
  font-family: monospace, sans-serif;
  color: #0f0;
}
body {
  margin: 0;
  padding: 0;
  background-color: #000000;
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

.v-icon_sound {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 80px;
  bottom: 80px;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
}
</style>
