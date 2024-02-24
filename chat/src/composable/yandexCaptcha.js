import { onMounted, onUnmounted, ref, watch } from 'vue';
import { authApi } from '@/api/appApi.ts';

function yandexCaptcha() {
  const widgetId = ref();
  const isInvisibleCaptcha = ref(true);

  onMounted(() => {
    render();
  });

  onUnmounted(() => {
    window.smartCaptcha.destroy(widgetId.value);
  });

  function render() {
    const id = window.smartCaptcha.render('captcha-container', {
      sitekey: 'ysc1_uEsjdc8w3VueN8qim5rk8kqgh0duyAlDaA9leVmIc20e730c',
      invisible: isInvisibleCaptcha.value,
      webview: true,
      shieldPosition: 'bottom-right',
      test: false,
    });
    widgetId.value = id;
  }

  function getInvisibleCaptcha() {
    window.smartCaptcha.execute(widgetId.value);
    return new Promise((success, expired) => {
      try {
        window.smartCaptcha.subscribe(widgetId.value, 'success', (token) => {
          success(token);
          window.smartCaptcha.reset(widgetId.value);
        });
        window.smartCaptcha.subscribe(widgetId.value, 'token-expired', () => {
          expired('token-expired');
          window.smartCaptcha.reset(widgetId.value);
        });
      } catch (e) {}
    });
  }

  function getVisibleCaptacha() {
    return new Promise((success, expired) => {
      try {
        let token = window.smartCaptcha.getResponse(widgetId.value);
        success(token);
      } catch (e) {
        expired('token-expired');
      }
    });
  }

  watch(
    () => isInvisibleCaptcha.value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        if (isInvisibleCaptcha.value) {
          const yaCaptchaCoontainer = document.querySelector('#captcha-container');
          yaCaptchaCoontainer.style = '';
        }
        window.smartCaptcha.destroy(widgetId.value);

        render();
      }
    }
  );

  async function getCaptchaResponse() {
    try {
      let token;
      if (isInvisibleCaptcha.value) {
        token = await getInvisibleCaptcha();
      } else {
        token = await getVisibleCaptacha();
      }
      const responseExecute = await authApi.executeYaCaptcha(token);
      if (responseExecute.data === 'Passed') {
        if (!isInvisibleCaptcha.value) {
          isInvisibleCaptcha.value = true;
          return true;
        }
      } else {
        // если включена "невидимая капча" и ошибка проверки, включать вторую, "видимую"
        if (isInvisibleCaptcha.value) {
          isInvisibleCaptcha.value = false;
          return;
        }
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return { getCaptchaResponse };
}

export default yandexCaptcha;
