<template>
  <a
    v-if="href"
    class="v-button"
    :href="href"></a>
  <button
    v-else
    class="v-button"
    :class="{ disabled: isDisabled }"
    :disabled="isDisabled"
    @click="onClick($event)">
    <Icon
      v-if="isIcon"
      :id="iconId"
      :color="iconColor" />
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import Icon from '@/components/assetsComponent/Icon.vue';

const emit = defineEmits(['onClick']);

const props = defineProps({
  text: {
    type: String,
    desc: 'Текст кнопки',
  },
  href: {
    type: String,
    desc: 'Ссылка кнопки',
  },
  isDisabled: {
    type: Boolean,
    desc: 'Дизейблим ли кнопку',
    default: false,
  },
  isIcon: {
    type: Boolean,
    desc: 'Отображать ли иконку',
    default: false,
  },
  iconId: {
    type: String,
    desc: 'id иконки',
  },
  iconColor: {
    type: String,
    desc: 'Цвет иконки',
    default: 'orange',
  },
});

function onClick(event: any) {
  emit('onClick', event);
}
</script>

<style lang="scss">
.v-button {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background: $blue;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &.disabled {
    opacity: 0.4;
    cursor: auto;

    &:hover {
      background: $blue;
    }
  }

  &:hover {
    transition: 0.3s;
    background: $darkBlue;
  }
}
</style>
