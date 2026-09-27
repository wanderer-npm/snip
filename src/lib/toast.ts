export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent('snip-toast', { detail: msg }));
}

export async function copyText(text: string, msg = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  toast(msg);
}
