import marked from './marked'
import { slugify } from '.'

export default function(hooks) {
  const renderer = new marked.Renderer()

  renderer.heading = function(text, level, raw) {
    const tag = `h${level}`

    const slug = slugify(raw)
    return `<${tag} id="${slug}">
      <SaikaLink class="header-anchor" :to="{ hash: '${slug}' }">
        ${text}
        <svg class="header-anchor-icon" width="11" height="11" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-432.000000, -181.000000)" fill="currentColor"><path d="M442.36949,184.673746 L440.543368,186.500079 C440.047223,186.996013 439.369736,187.191548 438.72445,187.101937 L439.934732,185.891655 L441.760854,184.065321 C442.26505,183.561549 442.26505,182.743395 441.760854,182.238988 C441.256658,181.735003 440.438928,181.735003 439.934732,182.238988 L438.10861,184.065321 L436.897904,185.275815 C436.808293,184.630529 437.003616,183.95283 437.499762,183.456684 L439.325883,181.630775 C440.166281,180.789742 441.528881,180.789742 442.369278,181.630775 C443.209887,182.470748 443.209887,183.833772 442.36949,184.673746 L442.36949,184.673746 Z M438.717247,185.891655 L436.891125,187.717565 L436.282277,187.108928 L438.10861,185.282594 L438.717247,185.891655 L438.717247,185.891655 Z M433.238882,188.934838 C432.734686,189.439246 432.734686,190.256552 433.238882,190.760959 C433.743078,191.265579 434.560807,191.265579 435.065003,190.760959 L436.891125,188.934838 L438.101619,187.724344 C438.191442,188.369842 437.996119,189.047329 437.499974,189.543474 L435.673852,191.369384 C434.833455,192.210205 433.470854,192.210205 432.630457,191.369384 C431.789848,190.529411 431.789848,189.166387 432.630457,188.326413 L434.456579,186.500079 C434.952724,186.003722 435.630423,185.808399 436.275709,185.898222 L435.065215,187.108928 L433.238882,188.934838 L433.238882,188.934838 Z"></path></g></g></svg>
      </SaikaLink>
    </${tag}>`
  }

  renderer.link = (href, _, text) =>
    `<SaikaLink to="${href}">${text}</SaikaLink>`

  // Disable template interpolation in code
  renderer.codespan = text => `<code v-pre class="inline-code">${text}</code>`
  const origCode = renderer.code
  renderer.code = function(code, lang, escaped) {
    let res = origCode.call(this, code, lang, escaped)
    res = res.replace(/^<pre>/, `<pre v-pre>`)
    return `<div data-lang="${lang || ''}" class="pre-wrapper">${res}</div>`
  }

  return hooks.process('extendMarkedRenderer', renderer)
}
