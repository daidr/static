import { defineConfig, tierPresets } from 'sponsorkit'

export default defineConfig({
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: tierPresets.xs,
    },
    {
      title: 'Backers',
    },
    {
      title: 'Sponsors',
      monthlyDollars: 10,
      preset: tierPresets.medium,
      // to insert custom elements after the tier block
      // composeAfter: (composer, _tierSponsors, _config) => {
      //   composer.addSpan(10)
      // },
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 15,
      preset: tierPresets.large,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 20,
      preset: tierPresets.xl,
    },
  ],
  sponsorsAutoMerge: true,
  outputDir: '.',
  formats: ['svg', 'png'],
  async onSponsorsReady(sponsors) {
    await fs.writeFile(
      'sponsors.json',
      JSON.stringify(
        sponsors
          .filter((i) => i.privacyLevel !== 'PRIVATE')
          .map((i) => {
            return {
              name: i.sponsor.name,
              login: i.sponsor.login,
              avatar: i.sponsor.avatarUrl,
              amount: i.monthlyDollars,
              link: i.sponsor.linkUrl || i.sponsor.websiteUrl,
              org: i.sponsor.type === 'Organization'
            }
          })
          .sort((a, b) => b.amount - a.amount),
        null,
        2
      )
    )
  },
  renders: [
    {
      name: 'sponsors',
      width: 800,
      formats: ['svg', 'png'],
    },
    {
      name: 'sponsors-wide',
      width: 1000,
      formats: ['svg'],
    },
    {
      renderer: 'circles',
      name: 'sponsors-circles',
      width: 1000,
      includePastSponsors: true,
    },
  ],
})
