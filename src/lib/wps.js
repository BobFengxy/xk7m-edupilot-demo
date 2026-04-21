// WPS WebOffice 签名与嵌入工具
//
// 竞赛演示策略：AppID / AppSecret 直接硬编码到前端。获得真实凭证后填入下方
// WPS_CONFIG 即可让 iframe 切换到真实 WPS WebOffice；未填写时自动回退 Mock 编辑器。
// 演示说明文档（需备案域名、appId、appSecret）：https://solution.wps.cn/

export const WPS_CONFIG = {
  // 从 WPS 开放平台获得后填入（留空则启用 Mock）
  appId: '',
  appSecret: '',
  // 线上域名（WPS 平台需备案该域名 + 允许 iframe 嵌入）
  endpoint: 'https://solution.wps.cn/api/v1/office',
}

// HMAC-SHA256 via Web Crypto API（无需引入 crypto-js）
async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function wpsTypeOf(fileName) {
  const ext = fileName.split('.').pop().toLowerCase()
  if (['doc', 'docx'].includes(ext)) return 'w'
  if (['ppt', 'pptx'].includes(ext)) return 's'
  if (['xls', 'xlsx'].includes(ext)) return 't'
  if (ext === 'pdf') return 'f'
  return null
}

// 真实 WPS 嵌入 URL（仅当 WPS_CONFIG 填写时可用）
// 参数顺序按字典序 join，末尾追加 appSecret 做 HMAC。
export async function buildWpsUrl({ fileId, fileName, userId = 'demo-teacher' }) {
  const type = wpsTypeOf(fileName) || 'w'
  const timestamp = Date.now().toString()
  const nonce = Math.random().toString(36).slice(2, 10)

  const params = {
    appid: WPS_CONFIG.appId,
    fileId,
    userId,
    type,
    mode: 'edit',
    timestamp,
    nonce,
  }

  const signBase = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  const signature = await hmacSha256Hex(WPS_CONFIG.appSecret, signBase)
  return `${WPS_CONFIG.endpoint}/${type}/${fileId}?${signBase}&signature=${signature}`
}

// 统一入口：返回 { mode: 'wps' | 'mock', url? }
export async function getEditorSource(file) {
  if (!WPS_CONFIG.appId || !WPS_CONFIG.appSecret) {
    return { mode: 'mock' }
  }
  try {
    const url = await buildWpsUrl({
      fileId: file.id || file.name,
      fileName: file.name,
    })
    return { mode: 'wps', url }
  } catch (e) {
    console.warn('[WPS] 签名失败，回退 Mock', e)
    return { mode: 'mock' }
  }
}
