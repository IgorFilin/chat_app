import { Injectable } from '@angular/core';
import { Config, OneTap } from '@vkid/sdk';
import * as VKID from '@vkid/sdk';

@Injectable({
  providedIn: 'root',
})
export class VkAuthService {
  constructor() {
    VKID.Config.init({
      app: 52897712, // Идентификатор приложения.
      redirectUrl: 'https://filin.tech', // Адрес для перехода после авторизации.
      state: 'test', // Произвольная строка состояния приложения.
      codeVerifier: 'test1', // Параметр в виде случайной строки. Обеспечивает защиту передаваемых данных.
      scope: 'email phone', // Список прав доступа, которые нужны приложению.
    });
  }

  initialOneTapButton() {
    // Создание экземпляра кнопки.
    const oneTap = new VKID.OneTap();

    // Получение контейнера из разметки.
    const container = document.getElementById('VkIdSdkOneTap');

    // Проверка наличия кнопки в разметке.
    if (container) {
      // Отрисовка кнопки в контейнере с именем приложения APP_NAME, светлой темой и на русском языке.
      oneTap
        .render({
          container: container,
          styles: {
            width: 250,
            borderRadius: 10,
          },
          scheme: VKID.Scheme.LIGHT,
          lang: VKID.Languages.RUS,
        })
        .on(VKID.WidgetEvents.ERROR, (error: any) => {
          console.warn(error);
        });
    }
  }
}
