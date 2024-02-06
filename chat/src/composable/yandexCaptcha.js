import { onMounted, ref } from 'vue';

function yandexCaptcha() {
  const resultCaptcha = ref(null);

  onMounted(() => {
    window.smartCaptcha.render('captcha-container', {
      sitekey: 'ysc1_uEsjdc8w3VueN8qim5rk8kqgh0duyAlDaA9leVmIc20e730c',
      invisible: true,
      webview: true,
      shieldPosition: 'top-left',
      callback: callback,
      test: false,
    });
  });

  function execute() {
    console.log('EXECUTE');
    window.smartCaptcha.execute();
  }

  async function callback(userToken) {
    // const response = await fetch(`http://localhost:3000/user/validateCaptcha?token=${userToken}`, {
    //   method: 'GET',
    // });
    // const result = await response.text();

    // if (result === 'Passed') {
    //   window.smartCaptcha.destroy();
    // }
    console.log(userToken);
  }

  return { execute };
}

export default yandexCaptcha;
