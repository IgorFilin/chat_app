/**
 * Утилита для генерации криптографически безопасных паролей
 *
 * @param length Длина пароля (по умолчанию 12)
 * @param options Опции для настройки сложности пароля
 * @param options.includeLowercase Включать строчные буквы (по умолчанию true)
 * @param options.includeUppercase Включать прописные буквы (по умолчанию true)
 * @param options.includeNumbers Включать цифры (по умолчанию true)
 * @param options.includeSymbols Включать специальные символы (по умолчанию true)
 * @returns Сгенерированный пароль
 *
 * @example
 * // Генерация пароля по умолчанию (12 символов, все наборы)
 * const password1 = generatePassword();
 *
 * // Генерация пароля с кастомными настройками
 * const password2 = generatePassword(16, {
 *   includeLowercase: true,
 *   includeUppercase: true,
 *   includeNumbers: true,
 *   includeSymbols: false
 * });
 */
function generatePassword(
  length: number = 12,
  options: {
    includeLowercase?: boolean;
    includeUppercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {}
): string {
  const { includeLowercase = true, includeUppercase = true, includeNumbers = true, includeSymbols = true } = options;

  // Определение наборов символов
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Формирование доступного набора символов
  let availableChars = '';
  if (includeLowercase) availableChars += lowercaseChars;
  if (includeUppercase) availableChars += uppercaseChars;
  if (includeNumbers) availableChars += numberChars;
  if (includeSymbols) availableChars += symbolChars;

  // Проверка, что хотя бы один набор символов включен
  if (availableChars.length === 0) {
    throw new Error('Должен быть включен хотя бы один набор символов');
  }

  // Генерация пароля с использованием криптографически безопасного генератора
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += availableChars[array[i] % availableChars.length];
  }

  return password;
}

export { generatePassword };
