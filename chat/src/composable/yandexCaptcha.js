import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { authApi } from '@/api/appApi.ts';
import router from '@/router/router';

function yandexCaptcha() {
  const widgetId = ref();
  const isInvisibleCaptcha = ref(true);

  // Выход из рендера капчи, в случае если нам это не нужно
  if (
    router.currentRoute.value.redirectedFrom?.path === '/main' ||
    (router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/registration')
  )
    return;

  onMounted(() => {
    render();
  });

  onUnmounted(() => {
    window.smartCaptcha.destroy(widgetId.value);
  });

  function render() {
    const id = window.smartCaptcha.render('captcha-container', {
      sitekey: import.meta.env.VITE_APP_YA_CAPTCHA_KEY,
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
        }
        return true;
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

  return getCaptchaResponse;
}

export default yandexCaptcha;
