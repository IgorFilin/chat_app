<template>
  <div
    class="v-message"
    :class="{ me: isMe(userId) }">
    <img
      :src="userPhoto"
      class="v-message__messagePhoto" />
    <div class="v-message__messageContentContainer">
      <div class="v-message__messageName">
        <div
          class="v-message__name"
          v-if="!isMe(userId)">
          {{ name }}
        </div>
        <MyComponent :message="message" />
      </div>
      <div>{{ date }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import MyComponent from '@/components/assetsComponent/Component.vue';

const props = defineProps({
  userId: {
    type: String,
  },
  userPhoto: {
    type: String,
  },
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  message: {
    type: [String, Array],
  },
});

const store = useAuthStore();
function isMe(id: string | undefined) {
  if (id) {
    return id === store.id;
  }
}
</script>

<style scoped lang="scss">
.v-message {
  display: flex;
  gap: 5px;
  align-items: center;
  align-self: flex-end;

  &.me {
    align-self: flex-start;

    .v-message__messageName {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      background: #a3b8bc;
      border-radius: 0 8px 8px 8px;

      // &:after {
      //   content: "";
      //   position: absolute;
      //   left: 0px;
      //   top: 15px;
      //   border: 7px solid transparent;
      //   border-right: 7px solid green;
      // }
    }
  }
}
.v-message__messagePhoto {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: brown;
}

.v-message__messageContentContainer {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}

.v-message__messageName {
  word-break: break-all;
  display: flex;
  padding: 14px 16px;
  word-wrap: break-word;
  flex-direction: column;
  background: #f0f0f0;
  font-size: 14px;
  line-height: 20px;
  justify-content: flex-end;
  align-self: flex-end;
  color: #333;
  border-radius: 0 8px 8px 8px;
  overflow: visible;
  white-space: pre-wrap;
  transition: 0.3s;
  scroll-margin-top: 16px;
  scroll-margin-bottom: 21px;
}

.v-message__name {
  position: relative;
  font-size: 12px;
  line-height: 15px;
  bottom: 6px;
}
</style>
