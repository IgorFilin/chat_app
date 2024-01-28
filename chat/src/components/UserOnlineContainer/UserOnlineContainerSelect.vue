<template>
  <div
    v-if="isOpen"
    class="v-usersOnline__popup">
    <div
      class="v-usersOnline__popupText"
      v-for="({ text, emitName }, index) in selectData"
      :key="index"
      @click="(event) => emit(emitName, event)">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
type SelectDataType = {
  text: string;
  emitName: any;
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    desc: 'Флажок для открытия, закрытия списка',
  },
  selectData: {
    type: Array<SelectDataType>,
    desc: 'Массив с пунктами селекта и событием возвращения',
  },
});

const emit = defineEmits(['onPrivateRoomHandler', 'goTo', 'sendInviteGame']);
</script>

<style lang="scss">
.v-usersOnline__popup {
  position: absolute;
  background: #090909;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 85px;
  height: fit-content;
  opacity: 1;
  color: #555;
  top: -10px;
  right: -90px;
}

.v-usersOnline__popupText {
  font-size: 15px;
  border: 1px solid $orange;
  box-sizing: border-box;
  padding: 2px;
  width: 100%;
  text-align: center;

  &:hover {
    cursor: pointer;
    background: $cacaoBlack;
  }
}
</style>
