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
