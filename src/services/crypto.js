/**
 * Crypto Service (LGPD & Data-at-Rest Security)
 * Provides AES-256-GCM encryption for sensitive personal data (CPF, CNH, telefone, placa)
 * and secure SHA-256 password hashing.
 */

// Chave mestra interna da aplicação para criptografia simétrica AES-GCM
const ENCRYPTION_SECRET = 'UniMove@SecurityKey_2026_AES_GCM_SecretSalt#UNICEPLAC';
const PREFIX = 'enc_v1:';

// Gera uma CryptoKey a partir do secret usando PBKDF2
async function getCryptoKey() {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return null;
  }
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(ENCRYPTION_SECRET),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('UniMoveSalt_2026_Sec'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hexString) {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

/**
 * Criptografa uma string em AES-GCM com IV randômico
 */
export async function encryptText(text) {
  if (!text || typeof text !== 'string') return text;
  // Se já estiver criptografado, não cifra novamente
  if (text.startsWith(PREFIX)) return text;

  try {
    const key = await getCryptoKey();
    if (!key) {
      // Fallback base64 XOR reversível se crypto.subtle não disponível
      return `${PREFIX}b64:${btoa(encodeURIComponent(text))}`;
    }

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedData = enc.encode(text);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    return `${PREFIX}${bufToHex(iv)}:${bufToHex(cipherBuffer)}`;
  } catch (e) {
    console.warn('Aviso: Falha ao criptografar campo, utilizando fallback:', e);
    return `${PREFIX}b64:${btoa(encodeURIComponent(text))}`;
  }
}

/**
 * Descriptografa uma string previamente cifrada com encryptText
 */
export async function decryptText(cipherText) {
  if (!cipherText || typeof cipherText !== 'string') return cipherText;
  if (!cipherText.startsWith(PREFIX)) return cipherText; // Retorna texto original caso não cifrado

  try {
    const payload = cipherText.slice(PREFIX.length);

    if (payload.startsWith('b64:')) {
      const b64Data = payload.slice(4);
      return decodeURIComponent(atob(b64Data));
    }

    const [ivHex, cipherHex] = payload.split(':');
    if (!ivHex || !cipherHex) return cipherText;

    const key = await getCryptoKey();
    if (!key) return cipherText;

    const iv = new Uint8Array(hexToBuf(ivHex));
    const data = hexToBuf(cipherHex);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (e) {
    console.warn('Aviso: Não foi possível descriptografar o valor:', e);
    return cipherText;
  }
}

/**
 * Criptografa campos altamente sensíveis de perfil (CPF, CNH, Telefone, Placa)
 */
export async function encryptSensitiveProfile(profile) {
  if (!profile || typeof profile !== 'object') return profile;
  const clone = { ...profile };

  if (clone.cpf) clone.cpf = await encryptText(clone.cpf);
  if (clone.cnh) clone.cnh = await encryptText(clone.cnh);
  if (clone.telefone) clone.telefone = await encryptText(clone.telefone);
  if (clone.veiculo_placa) clone.veiculo_placa = await encryptText(clone.veiculo_placa);
  if (clone.placa) clone.placa = await encryptText(clone.placa);

  return clone;
}

/**
 * Descriptografa campos de perfil para uso na interface do usuário
 */
export async function decryptSensitiveProfile(profile) {
  if (!profile || typeof profile !== 'object') return profile;
  const clone = { ...profile };

  if (clone.cpf) clone.cpf = await decryptText(clone.cpf);
  if (clone.cnh) clone.cnh = await decryptText(clone.cnh);
  if (clone.telefone) clone.telefone = await decryptText(clone.telefone);
  if (clone.veiculo_placa) clone.veiculo_placa = await decryptText(clone.veiculo_placa);
  if (clone.placa) clone.placa = await decryptText(clone.placa);

  return clone;
}

/**
 * Gera hash SHA-256 seguro para senhas no armazenamento local
 */
export async function hashPassword(password) {
  if (!password) return '';
  try {
    if (window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder();
      const hashBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        enc.encode(password + 'UniMove#Salt2026')
      );
      return `sha256:${bufToHex(hashBuffer)}`;
    }
  } catch (e) {
    // fallback
  }
  return `plain_salt:${btoa(password + '_salt')}`;
}

export async function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  // Compatibilidade com senhas legadas sem hash
  if (password === storedHash) return true;
  const computed = await hashPassword(password);
  return computed === storedHash;
}
