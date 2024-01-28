<template>
  <div
    v-if="isOpen"
    class="v-usersOnline__popup">
    <div
      class="v-usersOnline__popupText"
      v-for="({ text, emitName, action, additionalList }, index) in selectData"
      :key="index"
      @click="(event) => onClickContentHandler(event, emitName, action)">
      <span>{{ text }}</span>
      <div
        v-if="additionalList && isOpenAdditionalList"
        class="v-usersOnline__additionalList">
        <div
          v-for="({ text, type }, additionalIndex) in additionalList"
          :key="additionalIndex"
          class="v-usersOnline__popupText"
          @click="(event) => onClickAdditionalTextHandler(event, type)">
          {{ text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type SelectDataType = {
  text: string;
  additionalList?: Array<{ text: string; type: string }>;
  emitName?: string;
  action?: string;
};

const isOpenAdditionalList = ref(false);

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

function onClickContentHandler(event: any, emitName: any, action: any) {
  if (emitName) {
    emit(emitName, event);
  }
  switch (action) {
    case 'isOpenAdditionalList': {
      isOpenAdditionalList.value = !isOpenAdditionalList.value;
      break;
    }
  }
}

function onClickAdditionalTextHandler(event: any, type: string) {
  event.stopPropagation();
  emit('searchedGame', type);
}

const emit = defineEmits(['onPrivateRoomHandler', 'goTo', 'sendInviteGame', 'searchedGame']);
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

.v-usersOnline__additionalList {
  position: absolute;
  right: 103%;
  top: 0;
}
</style>
