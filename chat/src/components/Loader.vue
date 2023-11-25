<template>
  <div class="v-loader_container" :class="loaderFor">
    <span :class="setClass"></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  loaderFor: {
    type: String,
    desc: "Класс для выбора нужного лоадера",
    default: "main",
  },
});

const setClass = computed(() => {
  switch (props.loaderFor) {
    case "message":
      return "v-loader__message";
    default:
      return "v-loader__main";
  }
});
</script>

<style scoped lang="scss">
.v-loader_container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;

  &.main {
    position: absolute;
    top: 0;
    background-color: white;
  }

  &.message {
    position: relative;
  }
}
.v-loader__main {
  width: 48px;
  height: 24px;
  color: #fff;
  background: currentColor;
  border-radius: 50% 50% 0 0;
  position: relative;
  margin: auto;
  color: violet;
  display: block;
  margin: 60px auto 0;
  box-sizing: border-box;
  animation: animloader 4s linear infinite;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: currentColor;
    top: -34px;
    box-sizing: border-box;
    animation: animloader1 4s linear infinite;
  }

  @keyframes animloader {
    0% {
      box-shadow: 0 0 0 -2px, 0 0 0 -2px, 0 0 0 -5px, 0 0 0 -5px;
    }
    20% {
      box-shadow: 40px -1px 0 -2px, 0 0 0 -2px, 40px -1px 0 -5px, 0 0 0 -5px;
    }
    40% {
      box-shadow: 40px -1px 0 -2px, -40px -1px 0 -2px, 40px -1px 0 -5px,
        -40px -1px 0 -5px;
    }
    60% {
      box-shadow: 40px -1px 0 -2px, -40px -1px 0 -2px, 23px -29px 0 -5px,
        -40px -1px 0 -5px;
    }
    80%,
    95% {
      box-shadow: 40px -1px 0 -2px, -40px -1px 0 -2px, 23px -29px 0 -5px,
        -23px -29px 0 -5px;
    }
    100% {
      box-shadow: 40px -1px 0 -2px rgba(255, 255, 255, 0),
        -40px -1px 0 -2px rgba(255, 255, 255, 0),
        23px -29px 0 -5px rgba(255, 255, 255, 0),
        -23px -29px 0 -5px rgba(255, 255, 255, 0);
    }
  }

  @keyframes animloader1 {
    0% {
      box-shadow: 0 0 0 -2px, 0 0 0 -2px, 0 0 0 -5px, 0 0 0 -5px;
    }
    20% {
      box-shadow: 40px 2px 0 -2px, 0 0 0 -2px, 40px 2px 0 -5px, 0 0 0 -5px;
    }
    40% {
      box-shadow: 40px 2px 0 -2px, -40px 2px 0 -2px, 40px 2px 0 -5px,
        -40px 2px 0 -5px;
    }
    60% {
      box-shadow: 40px 2px 0 -2px, -40px 2px 0 -2px, 23px -23px 0 -5px,
        -40px 2px 0 -5px;
    }
    80%,
    95% {
      box-shadow: 40px 2px 0 -2px, -40px 2px 0 -2px, 23px -23px 0 -5px,
        -23px -23px 0 -5px;
    }
    100% {
      box-shadow: 40px 2px 0 -2px rgba(255, 255, 255, 0),
        -40px 2px 0 -2px rgba(255, 255, 255, 0),
        23px -23px 0 -5px rgba(255, 255, 255, 0),
        -23px -23px 0 -5px rgba(255, 255, 255, 0);
    }
  }
}

.v-loader__message {
  position: relative;
  border-style: solid;
  box-sizing: border-box;
  border-width: 40px 60px 30px 60px;
  border-color: #3760c9 #96ddfc #96ddfc #36bbf7;
  animation: envFloating 1s ease-in infinite alternate;

  &:after {
    content: "";
    position: absolute;
    right: 62px;
    top: -40px;
    height: 70px;
    width: 50px;
    background-image: linear-gradient(#fff 45px, transparent 0),
      linear-gradient(#fff 45px, transparent 0),
      linear-gradient(#fff 45px, transparent 0);
    background-repeat: no-repeat;
    background-size: 30px 4px;
    background-position: 0px 11px, 8px 35px, 0px 60px;
    animation: envDropping 0.75s linear infinite;
  }

  @keyframes envFloating {
    0% {
      transform: translate(-2px, -5px);
    }
    100% {
      transform: translate(0, 5px);
    }
  }

  @keyframes envDropping {
    0% {
      background-position: 100px 11px, 115px 35px, 105px 60px;
      opacity: 1;
    }
    50% {
      background-position: 0px 11px, 20px 35px, 5px 60px;
    }
    60% {
      background-position: -30px 11px, 0px 35px, -10px 60px;
    }
    75%,
    100% {
      background-position: -30px 11px, -30px 35px, -30px 60px;
      opacity: 0;
    }
  }
}
</style>
