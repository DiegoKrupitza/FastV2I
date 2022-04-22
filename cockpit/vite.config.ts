import { readFileSync } from 'fs'
import { resolve } from 'path'

import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import LinkAttributes from 'markdown-it-link-attributes'
import Prism from 'markdown-it-prism'
import { presetUno, presetWebFonts } from 'unocss'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Markdown from 'vite-plugin-md'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import SSGUtils from 'vite-plugin-ssg-utils'
import Layouts from 'vite-plugin-vue-layouts'

const markdownWrapperClasses = 'prose children:text-start'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    SSGUtils(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = readFileSync(path, 'utf-8')
        const { data } = matter(md)
        route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        return route
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
        'vitest',
        { 'vue-toastification': ['useToast'] },
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: '',
          enabledCollections: ['carbon', 'logos', 'vscode-icons'],
        }),
      ],

      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
      defaultStyle: 'display: inline-block; vertical-align: middle;',
    }),

    Unocss({
      presets: [
        presetUno({
          dark: 'class',
        }),
        presetWebFonts({
          fonts: {
            // these will extend the default theme
            sans: 'Montserrat:400,500,700',
          },
        }),
      ],
      shortcuts: [
        ['text-primary', 'text-black dark:text-white'],
        ['text-light', 'op95 dark:op85'],
        ['text-lighter', 'op70 dark:op60 fw400'],
        [
          'btn-base',
          'px-2 py-1 rounded inline-flex justify-center gap-2 children:mya !no-underline cursor-pointer text-black dark:text-white opacity-50 enabled:hover:opacity-80 disabled:op-40 disabled:cursor-default',
        ],
        ['icon-btn', 'btn-base leading-30px'],
        [
          'text-btn',
          'btn-base text-sm op-90 px-4 py-2 bg-green dark:bg-green500 enabled:hover:shadow-xl',
        ],
        ['prose', 'text-light fw400 lh-7'],
        ['flex-center', 'flex items-center'],
        [
          'card',
          'pa-4 border-solid border-2 border-$primary text-light shadow rounded flex flex-col gap-4 text-primary',
        ],
        ['subheading', 'mt-0 mb-2'],
        [
          'input',
          'pa-2 bg-$background text-primary border-1 border-$primary rounded disabled:op-50',
        ],
      ],
    }),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt'],
      manifest: {
        name: 'cockpit',
        short_name: 'cockpit',
        theme_color: '#ffffff',
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],

  server: {
    fs: {
      strict: true,
    },
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    format: 'cjs',
    includedRoutes(paths) {
      const staticPaths = paths.filter((path) => !path.includes(':'))
      const dynamicPaths = [] as string[]
      return [...staticPaths, ...dynamicPaths, '/404']
    },
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
      'vue-toastification',
    ],
    exclude: ['vue-demi'],
  },
})
