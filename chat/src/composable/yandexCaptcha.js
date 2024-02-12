import { onMounted, ref } from 'vue';

function yandexCaptcha() {
  const widgetId = ref();

  onMounted(() => {
    const resToken = window.smartCaptcha.render('captcha-container', {
      sitekey: 'ysc1_uEsjdc8w3VueN8qim5rk8kqgh0duyAlDaA9leVmIc20e730c',
      invisible: true,
      webview: true,
      shieldPosition: 'top-right',
      // callback: callback,
      test: true,
    });
    widgetId.value = resToken;
  });

  function execute() {
    console.log('EXECUTE');
    window.smartCaptcha.execute();
    window.smartCaptcha.subscribe(widgetId.value, 'success', (token) => {
      console.log('successTOKEN', token);
      window.smartCaptcha.reset(widgetId.value);
    });
    window.smartCaptcha.subscribe(widgetId.value, 'token-expired', () => {
      console.log('errorTOKEN');
      window.smartCaptcha.reset(widgetId.value);
    });
  }

  // async function callback(userToken) {
  //   const response = await fetch(`http://localhost:3000/user/validateCaptcha?token=${userToken}`, {
  //     method: 'GET',
  //   });
  //   const result = await response.text();

  //   if (result === 'Passed') {
  //     console.log(result);
  //     window.smartCaptcha.reset();
  //   }
  //   console.log(userToken);
  // }

  return { execute };
}

export default yandexCaptcha;
